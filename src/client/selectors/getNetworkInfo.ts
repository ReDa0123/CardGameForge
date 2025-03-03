import { ReduxState, NetworkState } from '../types/gameState';

export const getNetworkInfo = (state: ReduxState<any, any, any, any>): NetworkState => {
    return state.game.networkState || {};
};
