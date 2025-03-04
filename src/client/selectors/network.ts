import { ReduxState, NetworkState } from '../types';

export const getNetworkInfo = (state: ReduxState<any, any, any, any>): NetworkState => {
    return state.game.networkState || {};
};

export const getRoomPlayersCount = (state: ReduxState<any, any, any, any>) =>
    state.game.networkState?.players?.length || 0;

export const getRoomId = (state: ReduxState<any, any, any, any>) => state.game.networkState?.roomId;

export const isInLobby = (state: ReduxState<any, any, any, any>) =>
    !!state.game.networkState?.roomId;
