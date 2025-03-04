import { isGameActive } from '../isGameActive';
import { ReduxState, GameState } from '../../types';

describe('isGameActive selector', () => {
    it('should return true when game is in progress and has room ID', () => {
        const mockGameState: Partial<GameState<any, any, any, any>> = {
            coreState: {
                gameInProgress: true,
            } as GameState<any, any, any, any>['coreState'],
        };

        const mockState: ReduxState<any, any, any, any> = {
            game: {
                ...(mockGameState as GameState<any, any, any, any>),
                networkState: {
                    roomId: 'room-123',
                },
            },
        };

        const result = isGameActive(mockState as ReduxState<any, any, any, any>);
        expect(result).toBe(true);
    });

    it('should return false when game is not in progress', () => {
        const mockGameState: Partial<GameState<any, any, any, any>> = {
            coreState: {
                gameInProgress: false,
            } as GameState<any, any, any, any>['coreState'],
        };

        const mockState: ReduxState<any, any, any, any> = {
            game: {
                ...(mockGameState as GameState<any, any, any, any>),
                networkState: {
                    roomId: 'room-123',
                },
            },
        };

        const result = isGameActive(mockState as ReduxState<any, any, any, any>);
        expect(result).toBe(false);
    });

    it('should return false when room ID is missing', () => {
        const mockGameState: Partial<GameState<any, any, any, any>> = {
            coreState: {
                gameInProgress: true,
            } as GameState<any, any, any, any>['coreState'],
        };

        const mockState: ReduxState<any, any, any, any> = {
            game: {
                ...(mockGameState as GameState<any, any, any, any>),
                networkState: {
                    playerId: 'player-123',
                },
            },
        };

        const result = isGameActive(mockState as ReduxState<any, any, any, any>);
        expect(result).toBe(false);
    });

    it('should return false when networkState is undefined', () => {
        const mockGameState: Partial<GameState<any, any, any, any>> = {
            coreState: {
                gameInProgress: true,
            } as GameState<any, any, any, any>['coreState'],
        };

        const mockState: ReduxState<any, any, any, any> = {
            game: {
                ...(mockGameState as GameState<any, any, any, any>),
                networkState: null,
            },
        };

        const result = isGameActive(mockState as ReduxState<any, any, any, any>);
        expect(result).toBe(false);
    });
});
