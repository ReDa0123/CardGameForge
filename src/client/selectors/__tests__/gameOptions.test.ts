import { getGameOptions, getGameOptionsValue } from '../gameOptions';
import { ReduxState, GameState } from '../../types';

describe('gameOptions selectors', () => {
    const mockGameState: Partial<GameState<any, any, any, any>> = {
        gameOptions: {
            testOption: 'value',
            numberOption: 42,
        },
    };

    const mockState: ReduxState<any, any, any, any> = {
        game: {
            ...(mockGameState as GameState<any, any, any, any>),
        },
    };

    describe('getGameOptions', () => {
        it('should return the entire gameOptions object', () => {
            const result = getGameOptions(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual({
                testOption: 'value',
                numberOption: 42,
            });
        });
    });

    describe('getGameOptionsValue', () => {
        it('should return specific option value by key', () => {
            const getTestOption = getGameOptionsValue<string>('testOption');
            const getNumberOption = getGameOptionsValue<number>('numberOption');

            expect(getTestOption(mockState as ReduxState<any, any, any, any>)).toBe('value');
            expect(getNumberOption(mockState as ReduxState<any, any, any, any>)).toBe(42);
        });

        it('should return undefined for non-existent key', () => {
            const getNonExistent = getGameOptionsValue<string>('nonExistent');
            expect(getNonExistent(mockState as ReduxState<any, any, any, any>)).toBeUndefined();
        });
    });
});
