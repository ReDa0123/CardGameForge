import { ReduxState } from '../types/gameState';

export const getCurrentPlayer = (state: ReduxState<any, any, any, any>): string | undefined => {
    return state.game.coreState.turnOrder.activePlayer;
};
