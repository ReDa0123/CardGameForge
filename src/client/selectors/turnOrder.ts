import { ReduxState } from '../types';

/**
 * Selector to get the turn order from the redux state.
 * @param state - The redux state
 * @returns The turn order
 */
export const getTurnOrder = (state: ReduxState<any, any, any, any>) =>
    state.game.coreState.turnOrder;

/**
 * Selector to get the current player from the redux state.
 * @param state - The redux state
 * @returns The current player
 */
export const getCurrentPlayer = (state: ReduxState<any, any, any, any>): string | undefined => {
    return state.game.coreState.turnOrder.activePlayer;
};

/**
 * Selector to get the next player from the redux state.
 * @param state - The redux state
 * @returns The next player
 */
export const getNextPlayer = (state: ReduxState<any, any, any, any>): string | undefined => {
    return state.game.coreState.turnOrder.nextPlayer;
};

/**
 * Selector to get the play order from the redux state.
 * @param state - The redux state
 * @returns The play order
 */
export const getPlayOrder = (state: ReduxState<any, any, any, any>): string[] => {
    return state.game.coreState.turnOrder.playOrder;
};

/**
 * Selector to get the active player index from the redux state.
 * @param state - The redux state
 * @returns The active player index
 */
export const getActivePlayerIndex = (state: ReduxState<any, any, any, any>): number => {
    return state.game.coreState.turnOrder.activePlayerIndex;
};
