import { ReduxState } from '../types';

export const getPhase = (state: ReduxState<any, any, any, any>) => state.game.coreState.phase;
