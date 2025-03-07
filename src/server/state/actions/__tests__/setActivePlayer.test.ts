import { getInitialGameState, getMeta } from '../testUtils';
import { StateContext } from '../../../types';
import setActivePlayer from '../setActivePlayer';

const initialState = getInitialGameState({
    turnOrder: {
        activePlayer: '1',
        nextPlayer: '2',
        playOrder: ['1', '2', '3'],
        activePlayerIndex: 0,
    },
});

const ctxMock: Partial<
    StateContext<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>
> = {
    getState: jest.fn(() => initialState),
};

const meta = getMeta();

describe('setActivePlayer action', () => {
    it('should set the new active player if player exists and is not at the end of the order array', () => {
        const result = setActivePlayer.apply(
            { playerId: '2' },
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            meta
        );
        const turnOrder = {
            activePlayer: '2',
            nextPlayer: '3',
            playOrder: ['1', '2', '3'],
            activePlayerIndex: 1,
        };
        const expectedState = getInitialGameState({
            turnOrder,
        });
        expect(result.coreState.turnOrder).toEqual(turnOrder);
        expect(result).toEqual(expectedState);
    });

    it('should set the new active player if player exists and is at the end of the order array', () => {
        const result = setActivePlayer.apply(
            { playerId: '3' },
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            meta
        );
        const turnOrder = {
            activePlayer: '3',
            nextPlayer: '1',
            playOrder: ['1', '2', '3'],
            activePlayerIndex: 2,
        };
        const expectedState = getInitialGameState({
            turnOrder,
        });
        expect(result.coreState.turnOrder).toEqual(turnOrder);
        expect(result).toEqual(expectedState);
    });

    it('should return the same state if player does not exist', () => {
        const result = setActivePlayer.apply(
            { playerId: '4' },
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            meta
        );
        expect(result).toEqual(initialState);
    });
});
