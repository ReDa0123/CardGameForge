import { ReduxState } from '../types';

export const getGameOptions = (state: ReduxState<any, any, any, any>) => state.game.gameOptions;

export const getGameOptionsValue =
    <T>(key: string) =>
    (state: ReduxState<any, any, any, any>): T | undefined =>
        state.game.gameOptions[key];
