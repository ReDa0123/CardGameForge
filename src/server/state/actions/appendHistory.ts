import { actionTypes } from './actionTypes';
import { ActionTemplate, HistoryRecord } from '../../types';
import { assocByDotPath } from './utils';

export type AppendHistoryPayload = HistoryRecord<unknown>;

/**
 * Action to append a history record to the game state.
 * Payload - The history record to append.
 */
const appendHistory: ActionTemplate<AppendHistoryPayload> = {
    name: actionTypes.APPEND_HISTORY,
    apply: (payload, ctx) => {
        const historyRecord = payload;
        const state = ctx.getState();
        return assocByDotPath(state, 'coreState.history', [
            ...state.coreState.history,
            historyRecord,
        ]);
    },
};

export default appendHistory;
