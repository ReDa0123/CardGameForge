import {
    getTurnOrder,
    getCurrentPlayer,
    getNextPlayer,
    getPlayOrder,
    getActivePlayerIndex,
} from '../turnOrder';
import { GameState, ReduxState } from '../../types';
import { TurnOrder } from '../../../shared';

describe('turnOrder selectors', () => {
    const mockTurnOrder: TurnOrder = {
        activePlayer: 'player1',
        nextPlayer: 'player2',
        playOrder: ['player1', 'player2', 'player3', 'player4'],
        activePlayerIndex: 0,
    };

    const mockGameState: Partial<GameState<any, any, any, any>> = {
        coreState: {
            turnOrder: mockTurnOrder,
        } as GameState<any, any, any, any>['coreState'],
    };

    const mockState: ReduxState<any, any, any, any> = {
        game: {
            ...(mockGameState as GameState<any, any, any, any>),
        },
    };

    describe('getTurnOrder', () => {
        it('should return the complete turn order state', () => {
            const result = getTurnOrder(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual(mockTurnOrder);
        });
    });

    describe('getCurrentPlayer', () => {
        it('should return the active player', () => {
            const result = getCurrentPlayer(mockState as ReduxState<any, any, any, any>);
            expect(result).toBe('player1');
        });
    });

    describe('getNextPlayer', () => {
        it('should return the next player', () => {
            const result = getNextPlayer(mockState as ReduxState<any, any, any, any>);
            expect(result).toBe('player2');
        });
    });

    describe('getPlayOrder', () => {
        it('should return the play order array', () => {
            const result = getPlayOrder(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual(['player1', 'player2', 'player3', 'player4']);
        });
    });

    describe('getActivePlayerIndex', () => {
        it('should return the active player index', () => {
            const result = getActivePlayerIndex(mockState as ReduxState<any, any, any, any>);
            expect(result).toBe(0);
        });
    });
});
