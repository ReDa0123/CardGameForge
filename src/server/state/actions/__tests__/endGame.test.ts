import endGame from '../endGame';
import { HistoryRecord, StateContext } from '../../../types';
import { getInitialGameState, getMeta } from '../testUtils';
import { historyRecordsTypes } from '../../../constants';
import { actionTypes } from '../actionTypes';
import { EndGameResult } from '../../../../shared';

describe('endGame action', () => {
    it('should end the game and set endResult', () => {
        const initialState = getInitialGameState({ gameInProgress: true, endResult: null });
        const ctxMock: Partial<
            StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >
        > = {
            getState: jest.fn(() => initialState),
        };
        const endGameResult: EndGameResult = {
            isTie: false,
            winner: '1',
            reason: 'reason',
        };
        const meta = getMeta();
        const result = endGame.apply(
            endGameResult,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            meta
        );
        const expectedState = getInitialGameState({
            gameInProgress: false,
            endResult: endGameResult,
            history: [
                {
                    recordType: historyRecordsTypes.SYSTEM,
                    message: 'Game ended',
                    payload: endGameResult,
                    actionName: actionTypes.END_GAME,
                    meta: { ...meta, actionId: actionTypes.END_GAME },
                } as HistoryRecord<EndGameResult>,
            ],
        });

        expect(result.coreState.gameInProgress).toBe(false);
        expect(result.coreState.endResult).toEqual(endGameResult);
        expect(result).toEqual(expectedState);
    });
});
