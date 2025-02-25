import { ActionApply, ActionDefinition } from '../../types';
import { getRoomActionRegistry } from './roomGameData';

/**
 * Create and register a new action for a room.
 * @param roomId The ID of the room
 * @param actionName The name of the action
 * @param applyFn The function to apply the action
 */
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
