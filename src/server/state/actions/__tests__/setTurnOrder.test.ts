import setTurnOrder from '../setTurnOrder';
import { TurnOrder, StateContext } from '../../../types';
import { getInitialGameState, getMeta } from '../testUtils';

describe('setTurnOrder action', () => {
    it('should set a turn order at state.coreState.turnOrder', () => {
        const initialState = getInitialGameState();
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
        const newTurnOrder: TurnOrder = {
            activePlayer: '4',
            nextPlayer: '3',
            playOrder: ['3', '4'],
            activePlayerIndex: 2,
        };
        const result = setTurnOrder.apply(
            newTurnOrder,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            getMeta()
        );
        const expectedState = getInitialGameState({
            turnOrder: newTurnOrder,
        });

        expect(result.coreState.turnOrder).toEqual(newTurnOrder);
        expect(result).toEqual(expectedState);
    });
});
