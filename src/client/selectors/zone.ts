import { ReduxState, Zone, Card } from '../types';

/**
 * Selector to find a card in a zone.
 * @param cardId - The id of the card
 * @param zoneId - The id of the zone
 * @param state - The redux state
 * @returns The card
 */
export const findCardInZone =
    (cardId: string, zoneId: string) => (state: ReduxState<any, any, any, any>) => {
        const zone = state.game.coreState.zones[zoneId];
        if (!zone) {
            return undefined;
        }
        return zone.cards.find((card) => card.id === cardId);
    };

/**
 * Selector to get a zone by id.
 * @param zoneId - The id of the zone
 * @param state - The redux state
 * @returns The zone
 */
export const getZoneById =
    <CustomZone extends Record<string, any> = any, CustomCard extends Record<string, any> = any>(
        zoneId: string
    ) =>
    (state: ReduxState<any, any, any, any>): Zone<CustomZone, CustomCard> | undefined => {
        return state.game.coreState.zones[zoneId];
    };

/**
 * Selector to get zones by zone ids.
 * @param zoneIds - The ids of the zones
 * @param state - The redux state
 * @returns The zones
 */
export const getZonesByZoneIds =
    <CustomZone extends Record<string, any> = any, CustomCard extends Record<string, any> = any>(
        zoneIds: string[]
    ) =>
    (state: ReduxState<any, any, any, any>) => {
        return Object.values(state.game.coreState.zones).filter((zone) =>
            zoneIds.includes(zone.id)
        ) as Zone<CustomZone, CustomCard>[];
    };

/**
 * Selector to get the zone of a card.
 * @param cardId - The id of the card
 * @param state - The redux state
 * @returns The zone
 */
export const getZoneOfCard =
    <CustomZone extends Record<string, any> = any, CustomCard extends Record<string, any> = any>(
        cardId: string
    ) =>
    (state: ReduxState<any, any, any, any>) => {
        return Object.values(state.game.coreState.zones).find((zone) =>
            zone.cards.some((card) => card.id === cardId)
        ) as Zone<CustomZone, CustomCard> | undefined;
    };

/**
 * Selector to get the cards of a zone.
 * @param zoneId - The id of the zone
 * @param state - The redux state
 * @returns The cards
 */
export const getZoneCards =
    <CustomCard extends Record<string, any> = any>(zoneId: string) =>
    (state: ReduxState<any, any, any, any>) => {
        return state.game.coreState.zones[zoneId].cards as Card<CustomCard>[];
    };

/**
 * Selector to check if a zone is per player.
 * @param zoneId - The id of the zone
 * @param state - The redux state
 * @returns True if the zone is per player, false otherwise
 */
export const isPerPlayerZone =
    (zoneId: string) =>
    (state: ReduxState<any, any, any, any>): boolean => {
        return !!state.game.coreState.zones[zoneId]?.owner;
    };
