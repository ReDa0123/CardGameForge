import { ReduxState } from '../types';

/**
 * Selector to get the phase from the redux state.
 * @param state - The redux state
 * @returns The phase
 */
export const getPhase = (state: ReduxState<any, any, any, any>) => state.game.coreState.phase;
