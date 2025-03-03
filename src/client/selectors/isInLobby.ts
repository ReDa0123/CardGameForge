import { ReduxState } from '../types/gameState';

export const isInLobby = (state: ReduxState<any, any, any, any>) =>
    !!state.game.networkState?.roomId;
