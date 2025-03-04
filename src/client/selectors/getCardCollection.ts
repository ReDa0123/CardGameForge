import { ReduxState, CardTemplate } from '../types';

/**
 * Selector to get the card collection from the redux state.
 * @param state - The redux state
 * @returns The card collection
 */
export const getCardCollection =
    <CustomCard extends Record<string, any> = any>() =>
    (state: ReduxState<any, any, any, CustomCard>) =>
        state.game.coreState.cardCollection as CardTemplate<CustomCard>[];
