import { createSelector } from '@reduxjs/toolkit';
import { ReduxState } from '../types';

/**
 * Selector to get the network info from the redux state.
 * @param state - The redux state
 * @returns The network info
 */
export const getNetworkInfo = (state: ReduxState<any, any, any, any>) =>
    state.game.networkState || {};

/**
 * Selector to get the player ids from the redux state.
 * @param state - The redux state
 * @returns The player ids
 */
export const getPlayerIds = createSelector(
    (state: ReduxState<any, any, any, any>) => state.game.networkState?.players,
    (players) => players?.map((player) => player.playerId) || []
);

/**
 * Selector to get the player nicknames from the redux state.
 * @param state - The redux state
 * @returns The player nicknames
 */
export const getPlayerNicknames = createSelector(
    (state: ReduxState<any, any, any, any>) => state.game.networkState?.players,
    (players) => players?.map((player) => player.playerNickname) || []
);

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

/**
 * Selector to get the player id from the redux state.
 * @param state - The redux state
 * @returns The player id
 */
export const getYourPlayerId = (state: ReduxState<any, any, any, any>) =>
    state.game.networkState?.playerId;
