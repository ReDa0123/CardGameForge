import { GameConfig } from '../../types';

/**
 * The currently loaded game configuration.
 */
let loadedConfig: GameConfig<any, any, any, any> = {} as GameConfig<any, any, any, any>;

export const getLoadedConfig = <
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
>(): GameConfig<CS, CGO, CZ, CC> => {
    // cast from the stored "any" to the generics the caller expects
    return loadedConfig as GameConfig<CS, CGO, CZ, CC>;
};

export const setLoadedConfig = <
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
>(
    newLoadedConfig: GameConfig<CS, CGO, CZ, CC>
) => {
    loadedConfig = newLoadedConfig;
};
