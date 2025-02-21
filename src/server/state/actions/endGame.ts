import { EndGameResult, HistoryRecord } from '../../types/gameState';
import { ActionTemplate } from '../../types/gameConfig';
import { actionTypes } from './actionTypes';
import { historyRecordsTypes } from '../../constants';

const endGame: ActionTemplate<EndGameResult> = {
    name: actionTypes.END_GAME,
    apply: (payload, ctx, meta) => {
        const state = ctx.getState();
        return {
            ...state,
            coreState: {
                ...state.coreState,
                gameInProgress: false,
                endResult: payload,
                history: [
                    ...state.coreState.history,
                    {
                        recordType: historyRecordsTypes.SYSTEM,
                        message: 'Game ended',
                        payload,
                        meta: {
                            ...meta,
                            actionId: actionTypes.END_GAME,
                        },
                    } as HistoryRecord<EndGameResult>,
                ],
            },
        };
    },
};

export default endGame;
