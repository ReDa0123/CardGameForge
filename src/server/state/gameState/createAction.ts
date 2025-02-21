import { ActionApply, ActionDefinition } from '../../types/gameState';
import { getRoomActionRegistry } from './roomGameData';

export function createAction<
    ActionPayload,
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
>(roomId: string, actionName: string, applyFn: ActionApply<ActionPayload, CS, CGO, CZ, CC>): void {
    const gameRoomActionRegistry = getRoomActionRegistry<CS, CGO, CZ, CC>(roomId);
    if (!gameRoomActionRegistry) {
        throw new Error('Room not found');
    }

    const actionDefinition: ActionDefinition<ActionPayload, CS, CGO, CZ, CC> = {
        name: actionName,
        apply: applyFn,
        beforeHooks: [],
        afterHooks: [],
    };

    // Add the action with the correct typed signature
    gameRoomActionRegistry.addAction<ActionPayload>(actionDefinition);
}
