import { HistoryRecord, ActionTemplate, StateContext, Metadata } from '../../types';
import { actionTypes } from './actionTypes';
import { historyRecordsTypes } from '../../constants';
import { EndGameResult } from '../../../shared/types/gameState';

export type EndGamePayload = EndGameResult;

export const endGameApply = <
    CustomState extends Record<string, any> = Record<string, any>,
    CustomGameOptions extends Record<string, any> = Record<string, any>,
    CustomZone extends Record<string, any> = Record<string, any>,
    CustomCard extends Record<string, any> = Record<string, any>
>(
    payload: EndGamePayload,
    ctx: StateContext<CustomState, CustomGameOptions, CustomZone, CustomCard>,
    meta: Metadata
) => {
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
                    actionName: actionTypes.END_GAME,
                    meta: {
                        ...meta,
                        actionId: actionTypes.END_GAME,
                    },
                } as HistoryRecord<EndGamePayload>,
            ],
        },
    };
};

/**
 * Action to end the game.
 * Payload - End game result.
 */
const endGame: ActionTemplate<EndGamePayload> = {
    name: actionTypes.END_GAME,
    apply: endGameApply,
};

export default endGame;
