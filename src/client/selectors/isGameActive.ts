import { ReduxState } from '../types';

/**
 * Selector to check if the game is active.
 * @param state - The redux state
 * @returns True if the game is active, false otherwise
 */
export const isGameActive = (state: ReduxState<any, any, any, any>) =>
    (state.game.coreState.gameInProgress || !!state.game.coreState.endResult) &&
    !!state.game.networkState?.roomId;
