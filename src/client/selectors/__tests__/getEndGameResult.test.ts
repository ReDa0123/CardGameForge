import { getEndGameResult } from '../getEndGameResult';
import { GameState, ReduxState } from '../../types';
import { EndGameResult } from '../../../shared/types/gameState';

describe('getEndGameResult selector', () => {
    it('should return the end game result', () => {
        const mockEndResult: EndGameResult = {
            winner: 'Player 1',
            isTie: false,
            reason: 'Test reason',
        };

        const mockGameState: Partial<GameState<any, any, any, any>> = {
            coreState: {
                endResult: mockEndResult,
            } as GameState<any, any, any, any>['coreState'],
        };

        const mockState: ReduxState<any, any, any, any> = {
            game: {
                ...(mockGameState as GameState<any, any, any, any>),
            },
        };

        const result = getEndGameResult(mockState as ReduxState<any, any, any, any>);
        expect(result).toEqual(mockEndResult);
    });

    it('should return undefined when no end result exists', () => {
        const mockGameState: Partial<GameState<any, any, any, any>> = {
            coreState: {
                endResult: null,
            } as GameState<any, any, any, any>['coreState'],
        };
        const mockState: Partial<ReduxState<any, any, any, any>> = {
            game: {
                ...(mockGameState as GameState<any, any, any, any>),
            },
        };

        const result = getEndGameResult(mockState as ReduxState<any, any, any, any>);
        expect(result).toBeNull();
    });
});
