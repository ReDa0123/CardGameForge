import { ReduxState } from '../types';

/**
 * Selector to get the end game result from the redux state.
 * @param state - The redux state
 * @returns The end game result
 */
export const getEndGameResult = (state: ReduxState<any, any, any, any>) =>
    state.game.coreState.endResult;
