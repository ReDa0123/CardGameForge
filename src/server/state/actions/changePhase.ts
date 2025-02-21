import { ActionTemplate } from '../../types/gameConfig';
import { actionTypes } from './actionTypes';
import { changeStateValue } from './utils';

const changePhase: ActionTemplate<string> = {
    name: actionTypes.CHANGE_PHASE,
    apply: (payload, ctx) => {
        return changeStateValue(ctx.getState(), 'coreState.phase', payload);
    },
};

export default changePhase;
