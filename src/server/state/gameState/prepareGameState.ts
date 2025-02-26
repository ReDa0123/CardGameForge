import { createBaseRoomGameData, setRoomGameState } from './roomGameData';
import { createAction } from './createAction';
import { actionTypes, allLibActions } from '../actions';
import {
    ActionApply,
    GameState,
    GameConfig,
    HistoryRecord,
    NetworkState,
    TurnOrder,
    Zone,
    Metadata,
} from '../../types';
import { createStateContext } from './createStateContext';

/**
 * Prepare the initial game state for a room.
 * @param roomId The ID of the room
 * @param gameConfig The game configuration
 * @param roomNetworkState The network state of the room
 * @param gameOptions Optional game options
 */
export const prepareGameState = <
    CustomState extends Record<string, any>,
    CustomGameOptions extends Record<string, any>,
    CustomZone extends Record<string, any>,
    CustomCard extends Record<string, any>
>(
    roomId: string,
    gameConfig: GameConfig<CustomState, CustomGameOptions, CustomZone, CustomCard>,
    roomNetworkState: NetworkState,
    gameOptions?: CustomGameOptions
): GameState<CustomState, CustomGameOptions, CustomZone, CustomCard> => {
    // Create empty data structure for the room
    const roomGameData = createBaseRoomGameData<
        CustomState,
        CustomGameOptions,
        CustomZone,
        CustomCard
    >(roomId);

    // Register moves in the MoveRegistry
    for (const move of gameConfig.moves) {
        roomGameData.movesRegistry.addMove(move);
    }

    // Register library actions
    for (const action of allLibActions) {
        createAction<unknown, CustomState, CustomGameOptions, CustomZone, CustomCard>(
            roomId,
            action.name,
            action.apply as ActionApply<
                unknown,
                CustomState,
                CustomGameOptions,
                CustomZone,
                CustomCard
            >
        );
    }

    // Register user-defined actions
    for (const actionDef of gameConfig.actions) {
        createAction<unknown, CustomState, CustomGameOptions, CustomZone, CustomCard>(
            roomId,
            actionDef.name,
            actionDef.apply
        );
    }

    // Prepare zones
    const zones: { [zoneId: string]: Zone<CustomZone, CustomCard> } = {};
    for (const zone of gameConfig.zones) {
        if (zone.isPerPlayer) {
            // Create a separate zone for each player
            for (const player of roomNetworkState!.players) {
                zones[`${zone.zoneId}_${player.playerId}`] = {
                    id: `${zone.zoneId}_${player.playerId}`,
                    name: zone.zoneName,
                    type: zone.zoneId,
                    owner: player.playerId,
                    custom: zone.custom,
                    cards: [],
                };
            }
        } else {
            // Create a single zone
            zones[zone.zoneId] = {
                id: zone.zoneId,
                name: zone.zoneName,
                custom: zone.custom,
                cards: [],
            };
        }
    }

    // Create initial game state
    const initGameState: GameState<CustomState, CustomGameOptions, CustomZone, CustomCard> = {
        customState: gameConfig.customState ?? ({} as CustomState),
        gameOptions: gameOptions
            ? { ...gameConfig.defaultCustomGameOptions, ...gameOptions }
            : gameConfig.defaultCustomGameOptions,
        networkState: roomNetworkState,
        coreState: {
            gameInProgress: true,
            endResult: null,
            phase: gameConfig.phases.first,
            turnOrder: {
                activePlayer: '',
                nextPlayer: '',
                playOrder: [],
                activePlayerIndex: 0,
            },
            teams: null,
            cardCollection: gameConfig.cardCollection,
            zones,
            history: [] as HistoryRecord<unknown>[],
            randomSeed: gameConfig.randomSeed,
        },
    };

    // Store initial state in memory
    setRoomGameState(roomId, initGameState);

    // Create a context for dispatching actions
    const stateContext = createStateContext<CustomState, CustomGameOptions, CustomZone, CustomCard>(
        roomId
    );

    // Set up turn order
    const getDefaultTurnOrder = (): TurnOrder => {
        const playOrder = gameConfig.playOrder
            ? gameConfig.playOrder(stateContext)
            : roomNetworkState!.players.map((player) => player.playerId);

        return {
            activePlayer: playOrder[0] || '',
            nextPlayer: playOrder[1] || '',
            playOrder,
            activePlayerIndex: 0,
        };
    };

    stateContext.dispatchAction<TurnOrder>(actionTypes.SET_TURN_ORDER, getDefaultTurnOrder(), {
        roomId,
        timestamp: new Date(),
    });

    // Call gameSetup function
    const meta: Metadata = { roomId, timestamp: new Date() };
    const finalInitialGameState = gameConfig.gameSetup(stateContext, meta);

    // Overwrite the state with the result of gameSetup
    setRoomGameState(roomId, finalInitialGameState);
    return finalInitialGameState;
};
