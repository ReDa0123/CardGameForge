import { ReduxState, Selection } from '../types';

/**
 * Selector to get the selection from the redux state.
 * @param state - The redux state
 * @returns The selection
 */
export const getSelection = (state: ReduxState<any, any, any, any>): Selection => {
    return state.game.coreState.selection;
};

/**
 * Selector to get the selected cards in a zone from the redux state.
 * @param zoneId - The id of the zone
 * @param state - The redux state
 * @returns The selected cards in the zone
 */
export const getSelectedCardsInZone =
    (zoneId: string) =>
    (state: ReduxState<any, any, any, any>): string[] => {
        return state.game.coreState.selection[zoneId] || [];
    };
