import { GameConfig } from '../../types';

/**
 * The currently loaded game configuration.
 */
let loadedConfig: GameConfig<any, any, any, any> = {} as GameConfig<any, any, any, any>;

export const getLoadedConfig = <
    CS extends Record<string, any>,
    CGO extends Record<string, any>,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
>(): GameConfig<CS, CGO, CZ, CC> => {
    return loadedConfig as GameConfig<CS, CGO, CZ, CC>;
};

export const setLoadedConfig = <
    CS extends Record<string, any>,
    CGO extends Record<string, any>,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
>(
    newLoadedConfig: GameConfig<CS, CGO, CZ, CC>
) => {
    loadedConfig = newLoadedConfig;
};
