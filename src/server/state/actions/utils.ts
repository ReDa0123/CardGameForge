type DotPath = string;

/**
 * Deeply updates a nested value in an object based on a dot-separated path.
 * @param obj - The original object.
 * @param path - Dot-separated string path (e.g., "coreState.history").
 * @param value - The new value to set at the specified path.
 * @returns A new object with the updated value at the given path.
 */
export const changeStateValue = <T>(obj: T, path: DotPath, value: unknown): T => {
    const keys = path.split('.');

    // Recursively build the updated object
    const update = (currentObj: any, currentKeys: string[]): any => {
        if (currentKeys.length === 0) {
            return value;
        }

        const [key, ...rest] = currentKeys;
        return {
            ...currentObj,
            [key]: update(currentObj?.[key] ?? {}, rest),
        };
    };

    return update(obj, keys) as T;
};
