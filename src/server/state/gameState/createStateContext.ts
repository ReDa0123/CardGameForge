import fs from 'fs';
import path from 'path';
import seedrandom from 'seedrandom';
import { getRoomGameData, setRoomGameState } from './roomGameData';
import {
    ExtendedPayload,
    GameState,
    Metadata,
    PayloadHistoryRecord,
    StateContext,
} from '../../types/gameState';
import { historyRecordsTypes } from '../../constants';
import { getLoadedConfig } from './gameConfig';
import endGame from '../actions/endGame';
import { actionTypes } from '../actions';

/**
 * Returns a function that, when given an array,
 * shuffles it using a seed if provided or defaults to random.
 *
 * @param seed - number or string to seed the PRNG.
 *               If omitted, uses truly random.
 */
export const getRandomize = (seed?: number | string) => {
    // If seed is provided, convert it to string; otherwise use random seed
    const rng = seed ? seedrandom(String(seed)) : seedrandom();

    return <T>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            // rng() returns a float [0, 1), so multiply by (i + 1)
            // to pick an index up to i inclusive.
            const j = Math.floor(rng() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };
};

/**
 * Returns a function that, when called with a `relativePath`,
 * writes the `history` array as JSON to a file named by current timestamp.
 *
 * Usage:
 *   const exportFn = getExportHistory(history, filename);
 *   exportFn("./exports"); // writes ./exports/{1684067882284}|"filename".json
 */
const getExportHistory =
    <
        CustomState,
        CustomGameOptions,
        CustomZone extends Record<string, any>,
        CustomCard extends Record<string, any>
    >(
        getStateHistory: () => GameState<
            CustomState,
            CustomGameOptions,
            CustomZone,
            CustomCard
        >['coreState']['history']
    ) =>
    (relativePath: string, filename?: string) => {
        const history = getStateHistory();
        const fileName = filename ?? `${Date.now()}.json`;
        const fullPath = path.join(relativePath, fileName);
        const jsonData = JSON.stringify(history, null, 2);
        try {
            fs.writeFileSync(fullPath, jsonData, 'utf8');
        } catch (err) {
            console.error(err);
        }
    };

/**
 * Creates a `StateContext` object for a given room.
 * The context provides access to the current game state and
 * allows dispatching actions to update the state.
 * Also provides access to the randomize function and history export function.
 *
 * @param roomId
 */
export const createStateContext = <
    CustomState,
    CustomGameOptions,
    CustomZone extends Record<string, any>,
    CustomCard extends Record<string, any>
>(
    roomId: string
): StateContext<CustomState, CustomGameOptions, CustomZone, CustomCard> => {
    const gameData = getRoomGameData(roomId);
    if (!gameData) {
        throw new Error('Room not found');
    }

    const getState = <
        CustomState,
        CustomGameOptions,
        CustomZone extends Record<string, any>,
        CustomCard extends Record<string, any>
    >(): GameState<CustomState, CustomGameOptions, CustomZone, CustomCard> =>
        gameData.gameState as GameState<CustomState, CustomGameOptions, CustomZone, CustomCard>;

    const randomize = getRandomize(gameData.gameState.coreState.randomSeed);

    const exportHistory = getExportHistory<CustomState, CustomGameOptions, CustomZone, CustomCard>(
        () => getState().coreState.history
    );

    const getActionRegistry = () => gameData.actionRegistry;

    const getMovesRegistry = () => gameData.movesRegistry;

    const loadedConfig = getLoadedConfig<CustomState, CustomGameOptions, CustomZone, CustomCard>();

    const context: StateContext<CustomState, CustomGameOptions, CustomZone, CustomCard> = {
        getState,
        dispatchAction: () => getState(), // Placeholder dispatch that will be overwritten later
        randomize,
        getActionRegistry,
        getMovesRegistry,
        addBeforeHook: gameData.actionRegistry.addBeforeHook,
        addAfterHook: gameData.actionRegistry.addAfterHook,
        removeBeforeHook: gameData.actionRegistry.removeBeforeHook,
        removeAfterHook: gameData.actionRegistry.removeAfterHook,
        exportHistory,
        loadedConfig,
    };

    context.dispatchAction = <ActionPayload = unknown>(
        actionName: string,
        payload: ExtendedPayload<ActionPayload>,
        meta: Metadata
    ): GameState<CustomState, CustomGameOptions, CustomZone, CustomCard> => {
        // Get the action from the registry
        const action = gameData.actionRegistry.getAction(actionName);
        if (!action) {
            throw new Error('Action not found');
        }

        // Create a history record for the action
        let changedPayload = { ...payload };
        const payloadHistory: PayloadHistoryRecord<ExtendedPayload<ActionPayload>>[] = [
            {
                payload: changedPayload,
                actionId: actionName,
                isInitial: true,
            },
        ];
        // Create a metadata object for the action
        const actionMeta: Metadata = { ...meta, actionId: actionName };

        // beforeHooks execution
        for (const hook of action.beforeHooks) {
            const hookId = hook.id;
            // Create a metadata object for the hook
            const enhancedMeta: Metadata = { ...actionMeta, hookId };
            // Apply the hook
            const newPayload = hook.hookApply<
                unknown,
                CustomState,
                CustomGameOptions,
                CustomZone,
                CustomCard
            >(changedPayload, context, enhancedMeta);
            changedPayload = { ...changedPayload, ...newPayload };

            // Check if the hook should be removed
            if (hook.once || hook.removeCond?.(changedPayload, context, enhancedMeta)) {
                gameData.actionRegistry.removeBeforeHook(hookId, actionName);
            }

            // Create a history record for the hook
            const payloadRecord: PayloadHistoryRecord<ExtendedPayload<ActionPayload>> = {
                payload: changedPayload,
                hookId,
                actionId: actionName,
            };
            //Save the payload to the history
            payloadHistory.push(payloadRecord);

            //Check if it should abort the action
            if (newPayload.ABORT) {
                return getState();
            }
        }

        // Apply the action
        const newState = action.apply(changedPayload, context, actionMeta);
        setRoomGameState(roomId, newState);

        // afterHooks execution
        for (const hook of action.afterHooks) {
            const hookId = hook.id;
            // Create a metadata object for the hook
            const enhancedMeta: Metadata = { ...actionMeta, hookId };
            // Apply the hook
            const newPayload = hook.hookApply<
                unknown,
                CustomState,
                CustomGameOptions,
                CustomZone,
                CustomCard
            >(changedPayload, context, enhancedMeta);
            changedPayload = { ...changedPayload, ...newPayload };

            // Check if the hook should be removed
            if (hook.once || hook.removeCond?.(changedPayload, context, enhancedMeta)) {
                gameData.actionRegistry.removeAfterHook(hookId, actionName);
            }

            // Create a history record for the hook
            const payloadRecord: PayloadHistoryRecord<ExtendedPayload<ActionPayload>> = {
                payload: changedPayload,
                hookId,
                actionId: actionName,
            };
            //Save the payload to the history
            payloadHistory.push(payloadRecord);

            //Check if it should abort the action
            if (newPayload.ABORT) {
                return getState();
            }
        }

        const cardReactions = [];

        // Check for card reactions
        for (const zone of Object.values(newState.coreState.zones)) {
            for (const card of zone.cards) {
                const actionReaction = card.templateFields.actions?.[actionName];
                if (actionReaction) {
                    actionReaction<unknown, CustomState, CustomGameOptions, CustomZone, CustomCard>(
                        changedPayload,
                        context,
                        card.id
                    );
                    // Log the action to the history
                    cardReactions.push(card.id);
                }
            }
        }

        // Log the action to the history
        let finalState = { ...getState() };
        if (actionName === actionTypes.APPEND_HISTORY) {
            return finalState as GameState<CustomState, CustomGameOptions, CustomZone, CustomCard>;
        }
        finalState.coreState.history.push({
            recordType: historyRecordsTypes.ACTION,
            actionName,
            payloadHistory,
            originalPayload: payload,
            payload: changedPayload,
            meta: actionMeta,
            cardReactions,
        });

        setRoomGameState(roomId, finalState);

        // Check game end conditions
        const endGameResult = loadedConfig.endGameCondition(context);
        if (endGameResult) {
            finalState = endGame.apply(endGameResult, context, meta);
            finalState = loadedConfig.afterGameEnd(context, endGameResult);
            setRoomGameState(roomId, finalState);
        }

        return finalState as GameState<CustomState, CustomGameOptions, CustomZone, CustomCard>;
    };

    return context;
};
