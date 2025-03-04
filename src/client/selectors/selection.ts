import { ReduxState, Selection } from '../types';

export const getSelection = (state: ReduxState<any, any, any, any>): Selection => {
    return state.game.coreState.selection;
};

export const getSelectedCardsInZone =
    (zoneId: string) =>
    (state: ReduxState<any, any, any, any>): string[] => {
        return state.game.coreState.selection[zoneId] || [];
    };
