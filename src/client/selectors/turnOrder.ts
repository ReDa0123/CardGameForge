import { ReduxState } from '../types';

export const getTurnOrder = (state: ReduxState<any, any, any, any>) =>
    state.game.coreState.turnOrder;

export const getCurrentPlayer = (state: ReduxState<any, any, any, any>): string | undefined => {
    return state.game.coreState.turnOrder.activePlayer;
};

export const getNextPlayer = (state: ReduxState<any, any, any, any>): string | undefined => {
    return state.game.coreState.turnOrder.nextPlayer;
};

export const getPlayOrder = (state: ReduxState<any, any, any, any>): string[] => {
    return state.game.coreState.turnOrder.playOrder;
};

export const getActivePlayerIndex = (state: ReduxState<any, any, any, any>): number => {
    return state.game.coreState.turnOrder.activePlayerIndex;
};
