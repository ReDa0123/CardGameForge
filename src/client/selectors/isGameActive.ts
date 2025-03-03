import { ReduxState } from '../types/gameState';

export const isGameActive = (state: ReduxState<any, any, any, any>) =>
    state.game.coreState.gameInProgress && !!state.game.networkState?.roomId;
