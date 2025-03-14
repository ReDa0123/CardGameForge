import { ReduxState, Selection } from '../types';
import { memoizeWithIdentity } from './utils';

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
export const getSelectedCardsInZone = memoizeWithIdentity(
    (zoneId: string) =>
        (state: ReduxState<any, any, any, any>): string[] => {
            return state.game.coreState.selection[zoneId] || [];
        }
);

/**
 * Selector to check if a card is selected.
 * @param cardId - The id of the card
 * @param zoneId - The id of the zone
 * @param state - The redux state
 * @returns True if the card is selected, false otherwise
 */
export const isSelected = memoizeWithIdentity(
    (cardId: string, zoneId: string) => (state: ReduxState<any, any, any, any>) => {
        return getSelectedCardsInZone(zoneId)(state).includes(cardId);
    }
);
