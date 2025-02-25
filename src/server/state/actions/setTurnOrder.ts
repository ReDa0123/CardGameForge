import { ActionTemplate, TurnOrder } from '../../types';
import { actionTypes } from './actionTypes';
import { assocByDotPath } from './utils';

export type SetTurnOrderPayload = TurnOrder;

/**
 * Action to set the turn order in the game.
 * Payload - The turn order object.
 */
const setTurnOrder: ActionTemplate<SetTurnOrderPayload> = {
    name: actionTypes.SET_TURN_ORDER,
    apply: (payload, ctx) => {
        return assocByDotPath(ctx.getState(), 'coreState.turnOrder', payload);
    },
};

export default setTurnOrder;
