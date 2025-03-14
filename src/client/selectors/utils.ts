export const memoizeWithIdentity = <TArgs extends any[], TResult>(
    fn: (...args: TArgs) => TResult
): ((...args: TArgs) => TResult) => {
    const cache = new Map<string, TResult>();
    return (...args: TArgs) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key)!;
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};
