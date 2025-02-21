import { ActionDefinition, GameState, MoveDefinition } from '../../types/gameState';
import { ActionRegistry, MovesRegistry } from '../../types/registries';

export type RoomGameData<
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = {
    gameState: GameState<CS, CGO, CZ, CC>;
    actionRegistry: ActionRegistry<CS, CGO, CZ, CC>;
    movesRegistry: MovesRegistry<CS, CGO, CZ, CC>;
};

const roomGameData: Record<string, RoomGameData<any, any, any, any>> = {};

export function getRoomGameData<
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
>(roomId: string): RoomGameData<CS, CGO, CZ, CC> | undefined {
    return roomGameData[roomId] as RoomGameData<CS, CGO, CZ, CC> | undefined;
}

export function getRoomActionRegistry<
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
>(roomId: string) {
    const data = getRoomGameData<CS, CGO, CZ, CC>(roomId);
    return data?.actionRegistry;
}

export function setRoomGameState<
    CS,
    CGO,
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
 * action/moves registries.
 */
export function createBaseRoomGameData<
    CS,
    CGO,
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
        getAction: <ActionPayload>(actionName: string) => {
            return actionMap[actionName] as ActionDefinition<ActionPayload, CS, CGO, CZ, CC>;
        },
        addBeforeHook: (actionName, hookId, hookApply, options) => {
            const action = actionMap[actionName];
            if (!action) {
                throw new Error('Action not found');
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
                throw new Error('Action not found');
            }
            action.beforeHooks = action.beforeHooks.filter((hook: any) => hook.id !== hookId);
        },
        addAfterHook: (actionName, hookId, hookApply, options) => {
            const action = actionMap[actionName];
            if (!action) {
                throw new Error('Action not found');
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
                throw new Error('Action not found');
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

    const initData: RoomGameData<CS, CGO, CZ, CC> = {
        gameState: {} as GameState<CS, CGO, CZ, CC>,
        actionRegistry,
        movesRegistry,
    };

    roomGameData[roomId] = initData;
    return initData;
}

export function removeRoomGameData(roomId: string) {
    delete roomGameData[roomId];
}
