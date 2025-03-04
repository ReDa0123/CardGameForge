import { ReduxState } from '../types';

export const getEndGameResult = (state: ReduxState<any, any, any, any>) =>
    state.game.coreState.endResult;
