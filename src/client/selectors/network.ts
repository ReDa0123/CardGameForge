import { ReduxState, NetworkState } from '../types';

/**
 * Selector to get the network info from the redux state.
 * @param state - The redux state
 * @returns The network info
 */
export const getNetworkInfo = (state: ReduxState<any, any, any, any>): NetworkState => {
    return state.game.networkState || {};
};

/**
 * Selector to get the number of players in the room from the redux state.
 * @param state - The redux state
 * @returns The number of players in the room
 */
export const getRoomPlayersCount = (state: ReduxState<any, any, any, any>) =>
    state.game.networkState?.players?.length || 0;

/**
 * Selector to get the room id from the redux state.
 * @param state - The redux state
 * @returns The room id
 */
export const getRoomId = (state: ReduxState<any, any, any, any>) => state.game.networkState?.roomId;

/**
 * Selector to check if the client is in the lobby.
 * @param state - The redux state
 * @returns True if the client is in the lobby, false otherwise
 */
export const isInLobby = (state: ReduxState<any, any, any, any>) =>
    !!state.game.networkState?.roomId;
