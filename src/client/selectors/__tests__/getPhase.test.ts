import { getPhase } from '../getPhase';
import { GameState, ReduxState } from '../../types';

describe('getPhase selector', () => {
    it('should return the current game phase', () => {
        const mockPhase = 'PLAYING';
        const mockGameState: Partial<GameState<any, any, any, any>> = {
            coreState: {
                phase: mockPhase,
            } as GameState<any, any, any, any>['coreState'],
        };

        const mockState: ReduxState<any, any, any, any> = {
            game: {
                ...(mockGameState as GameState<any, any, any, any>),
            },
        };

        const result = getPhase(mockState as ReduxState<any, any, any, any>);
        expect(result).toBe(mockPhase);
    });
});
