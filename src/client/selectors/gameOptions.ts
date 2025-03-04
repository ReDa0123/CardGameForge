import { ReduxState } from '../types';

/**
 * Selector to get the game options from the redux state.
 * @param state - The redux state
 * @returns The game options
 */
export const getGameOptions = (state: ReduxState<any, any, any, any>) => state.game.gameOptions;

/**
 * Selector to get a specific game option from the redux state.
 * @param key - The key of the game option
 * @param state - The redux state
 * @returns The game options
 */
export const getGameOptionsValue =
    <T>(key: string) =>
    (state: ReduxState<any, any, any, any>): T | undefined =>
        state.game.gameOptions[key];
