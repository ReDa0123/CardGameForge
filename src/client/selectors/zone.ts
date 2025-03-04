import { ReduxState, Zone, Card } from '../types';

export const findCardInZone =
    (cardId: string, zoneId: string) => (state: ReduxState<any, any, any, any>) => {
        const zone = state.game.coreState.zones[zoneId];
        if (!zone) {
            return undefined;
        }
        return zone.cards.find((card) => card.id === cardId);
    };

export const getZoneById =
    <CustomZone extends Record<string, any> = any, CustomCard extends Record<string, any> = any>(
        zoneId: string
    ) =>
    (state: ReduxState<any, any, any, any>): Zone<CustomZone, CustomCard> | undefined => {
        return state.game.coreState.zones[zoneId];
    };

export const getZonesByZoneIds =
    <CustomZone extends Record<string, any> = any, CustomCard extends Record<string, any> = any>(
        zoneIds: string[]
    ) =>
    (state: ReduxState<any, any, any, any>) => {
        return Object.values(state.game.coreState.zones).filter((zone) =>
            zoneIds.includes(zone.id)
        ) as Zone<CustomZone, CustomCard>[];
    };

export const getZoneOfCard =
    <CustomZone extends Record<string, any> = any, CustomCard extends Record<string, any> = any>(
        cardId: string
    ) =>
    (state: ReduxState<any, any, any, any>) => {
        return Object.values(state.game.coreState.zones).find((zone) =>
            zone.cards.some((card) => card.id === cardId)
        ) as Zone<CustomZone, CustomCard> | undefined;
    };

export const getZoneCards =
    <CustomCard extends Record<string, any> = any>(zoneId: string) =>
    (state: ReduxState<any, any, any, any>) => {
        return state.game.coreState.zones[zoneId].cards as Card<CustomCard>[];
    };

export const isPerPlayerZone =
    (zoneId: string) =>
    (state: ReduxState<any, any, any, any>): boolean => {
        return !!state.game.coreState.zones[zoneId]?.owner;
    };
