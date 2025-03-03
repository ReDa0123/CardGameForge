import { ReduxState } from '../types/gameState';

export const getRoomPlayersCount = (state: ReduxState<any, any, any, any>) =>
    state.game.networkState?.players?.length || 0;
