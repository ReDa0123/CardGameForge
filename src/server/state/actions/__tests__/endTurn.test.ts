import { getInitialGameState, getMeta } from '../testUtils';
import { StateContext } from '../../../types';
import endTurn from '../endTurn';

describe('endTurn action', () => {
    it('should set the next player as the active player when active player is not the last one', () => {
        const initialState = getInitialGameState();
        const ctxMock: Partial<
            StateContext<unknown, unknown, Record<string, any>, Record<string, any>>
        > = {
            getState: jest.fn(() => initialState),
        };
        const result = endTurn.apply(
            {},
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        const expectedState = getInitialGameState({
            turnOrder: {
                activePlayer: '2',
                nextPlayer: '1',
                playOrder: ['1', '2'],
                activePlayerIndex: 1,
            },
        });

        expect(result.coreState.turnOrder.activePlayer).toBe('2');
        expect(result).toEqual(expectedState);
    });

    it('should set the next player as the active player when active player is the last one', () => {
        const initialState = getInitialGameState({
            turnOrder: {
                activePlayer: '2',
                nextPlayer: '1',
                playOrder: ['1', '2'],
                activePlayerIndex: 1,
            },
        });
        const ctxMock: Partial<
            StateContext<unknown, unknown, Record<string, any>, Record<string, any>>
        > = {
            getState: jest.fn(() => initialState),
        };
        const result = endTurn.apply(
            {},
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        const expectedState = getInitialGameState({
            turnOrder: {
                activePlayer: '1',
                nextPlayer: '2',
                playOrder: ['1', '2'],
                activePlayerIndex: 0,
            },
        });

        expect(result.coreState.turnOrder.activePlayer).toBe('1');
        expect(result).toEqual(expectedState);
    });

    it('should set the next player as the active player when active player is not the last one (more than 2 players)', () => {
        const initialState = getInitialGameState({
            turnOrder: {
                activePlayer: '1',
                nextPlayer: '2',
                playOrder: ['1', '2', '3'],
                activePlayerIndex: 0,
            },
        });
        const ctxMock: Partial<
            StateContext<unknown, unknown, Record<string, any>, Record<string, any>>
        > = {
            getState: jest.fn(() => initialState),
        };
        const result = endTurn.apply(
            {},
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        const expectedState = getInitialGameState({
            turnOrder: {
                activePlayer: '2',
                nextPlayer: '3',
                playOrder: ['1', '2', '3'],
                activePlayerIndex: 1,
            },
        });

        expect(result.coreState.turnOrder.activePlayer).toBe('2');
        expect(result).toEqual(expectedState);
    });

    it('should set the next player as the active player when active player is the last one (more than 2 players)', () => {
        const initialState = getInitialGameState({
            turnOrder: {
                activePlayer: '3',
                nextPlayer: '1',
                playOrder: ['1', '2', '3'],
                activePlayerIndex: 2,
            },
        });
        const ctxMock: Partial<
            StateContext<unknown, unknown, Record<string, any>, Record<string, any>>
        > = {
            getState: jest.fn(() => initialState),
        };
        const result = endTurn.apply(
            {},
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        const expectedState = getInitialGameState({
            turnOrder: {
                activePlayer: '1',
                nextPlayer: '2',
                playOrder: ['1', '2', '3'],
                activePlayerIndex: 0,
            },
        });

        expect(result.coreState.turnOrder.activePlayer).toBe('1');
        expect(result).toEqual(expectedState);
    });
});
