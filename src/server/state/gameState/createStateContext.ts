import fs from 'fs';
import path from 'path';
import seedrandom from 'seedrandom';
import { getRoomGameData, setRoomGameState } from './roomGameData';
import {
    ExtendedPayload,
    GameState,
    HistoryRecord,
    Metadata,
    PayloadHistoryRecord,
    StateContext,
} from '../../types';
import { historyRecordsTypes } from '../../constants';
import { getLoadedConfig } from './gameConfig';
import { endGameApply, actionTypes } from '../actions';

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
    (getStateHistory: () => HistoryRecord<any>[]) => (relativePath: string, filename?: string) => {
        const history = getStateHistory();
        const historyWithReadableDates = history.map((record) => ({
            ...record,
            meta: {
                ...record.meta,
                timestamp: record.meta.timestamp.toISOString(),
            },
            payloadHistory: record.payloadHistory?.map((payloadRecord) => ({
                ...payloadRecord,
                payload: {
                    ...payloadRecord.payload,
                    timestamp: payloadRecord.payload.timestamp.toISOString(),
                },
            })),
        }));
        const fileName = filename ?? `${new Date()}.json`;
        const fullPath = path.join(relativePath, fileName);
        const jsonData = JSON.stringify(historyWithReadableDates, null, 2);
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
 * Also provides access to the randomize function and history export function
 * and card creation function.
 * @param roomId
 */
export const createStateContext = <
    CustomState extends Record<string, any>,
    CustomGameOptions extends Record<string, any>,
    CustomZone extends Record<string, any>,
    CustomCard extends Record<string, any>
>(
    roomId: string
): StateContext<CustomState, CustomGameOptions, CustomZone, CustomCard> => {
    const gameData = getRoomGameData<CustomState, CustomGameOptions, CustomZone, CustomCard>(
        roomId
    );
    if (!gameData) {
        throw new Error('Room not found');
    }

    const getState = (): GameState<CustomState, CustomGameOptions, CustomZone, CustomCard> => {
        return gameData.gameState;
    };

    const randomize = getRandomize(gameData.gameState.coreState.randomSeed);

    const exportHistory = getExportHistory(
        () => getState().coreState.history as HistoryRecord<any>[]
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
        createCardFromTemplate: gameData.createCardFromTemplate,
    };

    context.dispatchAction = <ActionPayload = unknown>(
        actionName: string,
        payload: ActionPayload,
        meta: Metadata
    ): GameState<CustomState, CustomGameOptions, CustomZone, CustomCard> => {
        // Get the action from the registry
        const action = gameData.actionRegistry.getAction<ActionPayload>(actionName);
        if (!action) {
            if (loadedConfig.logErrors) {
                console.error(`Action ${actionName} not found`);
            }
            return getState();
        }

        // Check that payload is an object
        if (typeof payload !== 'object') {
            if (loadedConfig.logErrors) {
                console.error(`Payload for action ${actionName} should be an object`);
                return getState();
            }
        }

        // Create a history record for the action
        let changedPayload = {
            ...payload,
        } as ExtendedPayload<ActionPayload>;
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
            const newPayload = hook.hookApply(changedPayload, context, enhancedMeta);
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
                const state = getState();
                state.coreState.history.push({
                    recordType: historyRecordsTypes.ACTION,
                    actionName,
                    payloadHistory,
                    originalPayload: payload as ExtendedPayload<ActionPayload>,
                    payload: changedPayload,
                    meta: actionMeta,
                });
                return state;
            }
        }

        // Apply the action
        const newState = action.apply(changedPayload as ActionPayload, context, actionMeta);
        setRoomGameState(roomId, newState);

        // afterHooks execution
        for (const hook of action.afterHooks) {
            const hookId = hook.id;
            // Create a metadata object for the hook
            const enhancedMeta: Metadata = { ...actionMeta, hookId };
            // Apply the hook
            const newPayload = hook.hookApply(changedPayload, context, enhancedMeta);
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
                const state = getState();
                state.coreState.history.push({
                    recordType: historyRecordsTypes.ACTION,
                    actionName,
                    payloadHistory,
                    originalPayload: payload as ExtendedPayload<ActionPayload>,
                    payload: changedPayload,
                    meta: actionMeta,
                });
                return state;
            }
        }

        const cardReactions: string[] = [];

        // Check for card reactions
        for (const zone of Object.values(newState.coreState.zones)) {
            for (const card of zone.cards) {
                const actions = card.templateFields.actions;
                if (!actions) {
                    continue;
                }
                const actionReaction = actions[actionName];
                if (actionReaction) {
                    actionReaction(changedPayload, context, card.id, actionMeta);
                    // Log the action to the history
                    cardReactions.push(card.id);
                }
            }
        }

        let finalState = { ...getState() };
        // If the action is APPEND_HISTORY, return the state without appending the action to the history
        if (actionName === actionTypes.APPEND_HISTORY || actionName === actionTypes.END_GAME) {
            return finalState as GameState<CustomState, CustomGameOptions, CustomZone, CustomCard>;
        }
        // Log the action to the history
        finalState.coreState.history.push({
            recordType: historyRecordsTypes.ACTION,
            actionName,
            payloadHistory,
            originalPayload: payload as ExtendedPayload<ActionPayload>,
            payload: changedPayload,
            meta: actionMeta,
            cardReactions,
        });

        setRoomGameState(roomId, finalState);

        // Check game end conditions
        const endGameResult = loadedConfig.endGameCondition(context);
        if (endGameResult) {
            finalState = endGameApply<CustomState, CustomGameOptions, CustomZone, CustomCard>(
                endGameResult,
                context,
                meta
            );
            setRoomGameState(roomId, finalState);
            finalState = loadedConfig.afterGameEnd(context, endGameResult, meta);
            setRoomGameState(roomId, finalState);
        }

        return finalState as GameState<CustomState, CustomGameOptions, CustomZone, CustomCard>;
    };

    return context;
};
