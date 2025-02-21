import { actionTypes } from './actionTypes';
import { ActionTemplate } from '../../types/gameConfig';
import { HistoryRecord } from '../../types/gameState';
import { changeStateValue } from './utils';

const appendHistory: ActionTemplate<HistoryRecord<unknown>> = {
    name: actionTypes.APPEND_HISTORY,
    apply: (payload, ctx) => {
        const historyRecord = payload;
        const state = ctx.getState();
        return changeStateValue(state, 'coreState.history', [
            ...state.coreState.history,
            historyRecord,
        ]);
    },
};

export default appendHistory;
