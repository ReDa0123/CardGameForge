import changePhase from '../changePhase';
import { getInitialGameState, getMeta } from '../testUtils';
import { StateContext } from '../../../types/gameState';

describe('changePhase action', () => {
    it('should change the phase', () => {
        const initialState = getInitialGameState({ phase: 'first' });
        const ctxMock: Partial<
            StateContext<unknown, unknown, Record<string, any>, Record<string, any>>
        > = {
            getState: jest.fn(() => initialState),
        };
        const newPhase = 'second';
        const result = changePhase.apply(
            newPhase,
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        const expectedState = getInitialGameState({
            phase: newPhase,
        });
        expect(result.coreState.phase).toEqual(newPhase);
        expect(result).toEqual(expectedState);
    });
});
