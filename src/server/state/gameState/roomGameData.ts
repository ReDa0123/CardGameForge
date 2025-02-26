import {
    ActionDefinition,
    GameState,
    MoveDefinition,
    ActionRegistry,
    MovesRegistry,
    Card,
    CardTemplate,
} from '../../types';
import { getLoadedConfig } from './gameConfig';

export type RoomGameData<
    CS extends Record<string, any>,
    CGO extends Record<string, any>,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = {
    gameState: GameState<CS, CGO, CZ, CC>;
    actionRegistry: ActionRegistry<CS, CGO, CZ, CC>;
    movesRegistry: MovesRegistry<CS, CGO, CZ, CC>;
    createCardFromTemplate: <
        DisplayProps extends Record<string, any> = Record<string, any>,
        CardState extends Record<string, any> = Record<string, any>
    >(
        cardTemplate: CardTemplate<CC>,
        displayProps?: DisplayProps,
        initialState?: CardState
    ) => Card<CC, DisplayProps, CardState>;
};

/**
 * A map of room IDs to their game data.
 */
const roomGameData: Record<string, RoomGameData<any, any, any, any>> = {};

export function getRoomGameData<
    CS extends Record<string, any>,
    CGO extends Record<string, any>,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
>(roomId: string): RoomGameData<CS, CGO, CZ, CC> | undefined {
    return roomGameData[roomId] as RoomGameData<CS, CGO, CZ, CC> | undefined;
}

export function getRoomActionRegistry<
    CS extends Record<string, any>,
    CGO extends Record<string, any>,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
>(roomId: string) {
    const data = getRoomGameData<CS, CGO, CZ, CC>(roomId);
    return data?.actionRegistry;
}

export function setRoomGameState<
    CS extends Record<string, any>,
    CGO extends Record<string, any>,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
>(roomId: string, newGameState: GameState<CS, CGO, CZ, CC>) {
    const data = roomGameData[roomId] as RoomGameData<CS, CGO, CZ, CC>;
    if (data) {
        data.gameState = newGameState;
    }
}

/**
 * Create a new base set of data for a room, with blank or default
 * action/moves registries and helper functions.
 */
export function createBaseRoomGameData<
    CS extends Record<string, any>,
    CGO extends Record<string, any>,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
>(roomId: string): RoomGameData<CS, CGO, CZ, CC> {
    const actionMap: Record<string, any> = {};
    const moveMap: Record<string, any> = {};

    const actionRegistry: ActionRegistry<CS, CGO, CZ, CC> = {
        actions: actionMap,
        addAction: (action) => {
            actionMap[action.name] = action;
        },
        removeAction: (actionName) => {
            delete actionMap[actionName];
        },
        getAction: <ActionPayload>(
            actionName: string
        ): ActionDefinition<ActionPayload, CS, CGO, CZ, CC> | undefined => {
            return actionMap[actionName];
        },
        addBeforeHook: (actionName, hookId, hookApply, options) => {
            const action = actionMap[actionName];
            if (!action) {
                if (getLoadedConfig<any, any, any, any>().logErrors) {
                    console.error('Action not found');
                }
                return;
            }
            action.beforeHooks.push({
                id: hookId,
                actionName,
                hookApply,
                once: options?.once ?? false,
                removeCond: options?.removeCond,
            });
        },
        removeBeforeHook: (hookId, actionName) => {
            const action = actionMap[actionName];
            if (!action) {
                if (getLoadedConfig<any, any, any, any>().logErrors) {
                    console.error('Action not found');
                }
                return;
            }
            action.beforeHooks = action.beforeHooks.filter((hook: any) => hook.id !== hookId);
        },
        addAfterHook: (actionName, hookId, hookApply, options) => {
            const action = actionMap[actionName];
            if (!action) {
                if (getLoadedConfig<any, any, any, any>().logErrors) {
                    console.error('Action not found');
                }
                return;
            }
            action.afterHooks.push({
                id: hookId,
                actionName,
                hookApply,
                once: options?.once ?? false,
                removeCond: options?.removeCond,
            });
        },
        removeAfterHook: (hookId, actionName) => {
            const action = actionMap[actionName];
            if (!action) {
                if (getLoadedConfig<any, any, any, any>().logErrors) {
                    console.error('Action not found');
                }
                return;
            }
            action.afterHooks = action.afterHooks.filter((hook: any) => hook.id !== hookId);
        },
    };

    const movesRegistry: MovesRegistry<CS, CGO, CZ, CC> = {
        moves: moveMap,
        addMove: (move) => {
            moveMap[move.name] = move;
        },
        removeMove: (moveName) => {
            delete moveMap[moveName];
        },
        getMove: <MovePayload>(moveName: string) => {
            return moveMap[moveName] as MoveDefinition<MovePayload, CS, CGO, CZ, CC>;
        },
    };

    const getCreateCardFromTemplate = <
        CS extends Record<string, any>,
        CGO extends Record<string, any>,
        CZ extends Record<string, any>,
        CC extends Record<string, any>
    >(): RoomGameData<CS, CGO, CZ, CC>['createCardFromTemplate'] => {
        const idsCount: Record<string, number> = {};
        return function <
            DisplayProps extends Record<string, any> = Record<string, any>,
            CardState extends Record<string, any> = Record<string, any>
        >(
            cardTemplate: CardTemplate<CC>,
            displayProps?: DisplayProps,
            initialState?: CardState
        ): Card<CC, DisplayProps, CardState> {
            const id = cardTemplate.id;
            const count = idsCount[id] ?? 0;
            idsCount[id] = count + 1;

            return {
                id: `${id}_${count}`,
                templateId: id,
                templateFields: {
                    name: cardTemplate.name,
                    displayType: cardTemplate.displayType,
                    moves: cardTemplate.moves,
                    actions: cardTemplate.actions,
                    custom: cardTemplate.custom,
                },
                state: initialState,
                displayProps,
            };
        };
    };

    const initData: RoomGameData<CS, CGO, CZ, CC> = {
        gameState: {} as GameState<CS, CGO, CZ, CC>,
        actionRegistry,
        movesRegistry,
        createCardFromTemplate: getCreateCardFromTemplate<CS, CGO, CZ, CC>(),
    };

    roomGameData[roomId] = initData;
    return initData;
}

export function removeRoomGameData(roomId: string) {
    delete roomGameData[roomId];
}
