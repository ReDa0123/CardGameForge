import { ActionTemplate } from '../../types/gameConfig';
import { TurnOrder } from '../../types/gameState';
import { actionTypes } from './actionTypes';
import { changeStateValue } from './utils';

const setTurnOrder: ActionTemplate<TurnOrder> = {
    name: actionTypes.SET_TURN_ORDER,
    apply: (payload, ctx) => {
        return changeStateValue(ctx.getState(), 'coreState.turnOrder', payload);
    },
};

export default setTurnOrder;
