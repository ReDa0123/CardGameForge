import { ReduxState } from '../types';

export const isGameActive = (state: ReduxState<any, any, any, any>) =>
    state.game.coreState.gameInProgress && !!state.game.networkState?.roomId;
