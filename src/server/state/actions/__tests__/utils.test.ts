import { assocByDotPath } from '../utils';

describe('changeStateValue', () => {
    it('should update a nested value in an object based on a dot-separated path', () => {
        const obj = {
            coreState: {
                history: [],
            },
        };
        const path = 'coreState.history';
        const value = [{ id: 1, action: 'test' }];
        const expected = {
            coreState: {
                history: value,
            },
        };
        const result = assocByDotPath(obj, path, value);
        expect(result).toEqual(expected);
    });

    it('should create nested objects if they do not exist', () => {
        const obj = {} as {
            coreState: {
                history: { id: number; action: string }[];
            };
        };
        const path = 'coreState.history';
        const value = [{ id: 1, action: 'test' }];
        const expected = {
            coreState: {
                history: value,
            },
        };
        const result = assocByDotPath(obj, path, value);
        expect(result).toEqual(expected);
    });

    it('should update a deeply nested value in an object', () => {
        const obj = {
            coreState: {
                history: [],
                otherState: {
                    nested: {
                        value: 42,
                    },
                },
            },
            customState: {},
        };
        const path = 'coreState.otherState.nested.value';
        const value = 100;
        const result = assocByDotPath(obj, path, value);
        const expected = {
            coreState: {
                history: [],
                otherState: {
                    nested: {
                        value,
                    },
                },
            },
            customState: {},
        };
        expect(result).toEqual(expected);
    });

    it('should not modify the original object', () => {
        const obj = {
            coreState: {
                history: [],
            },
        };
        const path = 'coreState.history';
        const value = [{ id: 1, action: 'test' }];
        const result = assocByDotPath(obj, path, value);
        expect(obj).not.toEqual(result);
    });
});
