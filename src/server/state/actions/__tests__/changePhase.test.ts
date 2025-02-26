import changePhase from '../changePhase';
import { getInitialGameState, getMeta } from '../testUtils';
import { GameConfig, StateContext } from '../../../types';

const initialState = getInitialGameState({ phase: 'first' });
const mockLoadedConfig: Partial<GameConfig<any, any, Record<string, any>, Record<string, any>>> = {
    phases: {
        first: 'first',
        phasesList: [{ name: 'first', next: 'second' }, { name: 'second' }],
    },
};

const ctxMock: Partial<
    StateContext<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>
> = {
    getState: jest.fn(() => initialState),
    loadedConfig: mockLoadedConfig as GameConfig<
        Record<string, any>,
        Record<string, any>,
        Record<string, any>,
        Record<string, any>
    >,
};

describe('changePhase action', () => {
    it('should change the phase for defined phase', () => {
        const newPhase = { phase: 'second' };
        const result = changePhase.apply(
            newPhase,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            getMeta()
        );
        const expectedState = getInitialGameState({
            phase: newPhase.phase,
        });
        expect(result.coreState.phase).toEqual(newPhase.phase);
        expect(result).toEqual(expectedState);
    });

    it('should change to the next phase for empty phase payload', () => {
        const newPhase = { phase: '' };
        const result = changePhase.apply(
            newPhase,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            getMeta()
        );
        const expectedState = getInitialGameState({
            phase: 'second',
        });
        expect(result.coreState.phase).toEqual('second');
        expect(result).toEqual(expectedState);
    });

    it('should return the same state if the phase is not found', () => {
        const newPhase = { phase: 'third' };
        const result = changePhase.apply(
            newPhase,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            getMeta()
        );
        expect(result).toEqual(initialState);
    });

    it('should return the same state if the next phase is not found', () => {
        const initialState = getInitialGameState({ phase: 'second' });
        const newPhase = { phase: '' };
        const result = changePhase.apply(
            newPhase,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            getMeta()
        );
        expect(result).toEqual(initialState);
    });
});
