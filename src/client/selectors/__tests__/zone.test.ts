import {
    findCardInZone,
    getZoneById,
    getZonesByZoneIds,
    getZoneOfCard,
    getZoneCards,
    isPerPlayerZone,
} from '../zone';
import { ReduxState, Zone, Card, GameState } from '../../types';

describe('zone selectors', () => {
    interface CustomZone {
        customZoneField: string;
    }

    interface CustomCard {
        customCardField: string;
    }

    const mockCard1: Card<CustomCard> = {
        id: 'card1',
        templateId: 'card1',
        templateFields: {
            name: 'Card 1',
            displayType: 'card',
            custom: {
                customCardField: 'value1',
            },
        },
    };

    const mockCard2: Card<CustomCard> = {
        id: 'card2',
        templateId: 'card2',
        templateFields: {
            name: 'Card 2',
            displayType: 'card',
            custom: {
                customCardField: 'value2',
            },
        },
    };

    const mockZone1: Zone<CustomZone, CustomCard> = {
        id: 'zone1',
        name: 'Zone 1',
        cards: [mockCard1],
        custom: {
            customZoneField: 'zoneValue1',
        },
        owner: 'player1',
        type: 'zone',
    };

    const mockZone2: Zone<CustomZone, CustomCard> = {
        id: 'zone2',
        name: 'Zone 2',
        cards: [mockCard2],
        custom: {
            customZoneField: 'zoneValue2',
        },
    };

    const zones: { [zoneId: string]: Zone<CustomZone, CustomCard> } = {
        zone1: mockZone1,
        zone2: mockZone2,
    };

    const mockGameState: Partial<GameState<any, any, any, any>> = {
        coreState: {
            zones,
        } as GameState<any, any, any, any>['coreState'],
    };
    const mockState: Partial<ReduxState<any, any, any, any>> = {
        game: {
            ...(mockGameState as GameState<any, any, any, any>),
        },
    };

    describe('findCardInZone', () => {
        it('should find a card in a zone', () => {
            const findCard = findCardInZone('card1', 'zone1');
            const result = findCard(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual(mockCard1);
        });

        it('should return undefined for non-existent card', () => {
            const findCard = findCardInZone('nonExistent', 'zone1');
            const result = findCard(mockState as ReduxState<any, any, any, any>);
            expect(result).toBeUndefined();
        });

        it('should return undefined for non-existent zone', () => {
            const findCard = findCardInZone('card1', 'nonExistent');
            const result = findCard(mockState as ReduxState<any, any, any, any>);
            expect(result).toBeUndefined();
        });
    });

    describe('getZoneById', () => {
        it('should return a zone by ID', () => {
            const getZone = getZoneById<CustomZone, CustomCard>('zone1');
            const result = getZone(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual(mockZone1);
        });

        it('should return undefined for non-existent zone', () => {
            const getZone = getZoneById<CustomZone, CustomCard>('nonExistent');
            const result = getZone(mockState as ReduxState<any, any, any, any>);
            expect(result).toBeUndefined();
        });
    });

    describe('getZonesByZoneIds', () => {
        it('should return zones for given IDs', () => {
            const getZones = getZonesByZoneIds<CustomZone, CustomCard>(['zone1', 'zone2']);
            const result = getZones(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual([mockZone1, mockZone2]);
        });

        it('should return empty array for non-existent zone IDs', () => {
            const getZones = getZonesByZoneIds<CustomZone, CustomCard>(['nonExistent']);
            const result = getZones(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual([]);
        });
    });

    describe('getZoneOfCard', () => {
        it('should return zone containing the card', () => {
            const getZone = getZoneOfCard<CustomZone, CustomCard>('card1');
            const result = getZone(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual(mockZone1);
        });

        it('should return undefined for non-existent card', () => {
            const getZone = getZoneOfCard<CustomZone, CustomCard>('nonExistent');
            const result = getZone(mockState as ReduxState<any, any, any, any>);
            expect(result).toBeUndefined();
        });
    });

    describe('getZoneCards', () => {
        it('should return cards in a zone', () => {
            const getCards = getZoneCards<CustomCard>('zone1');
            const result = getCards(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual([mockCard1]);
        });
    });

    describe('isPerPlayerZone', () => {
        it('should return true for zones with an owner', () => {
            const checkPerPlayer = isPerPlayerZone('zone1');
            const result = checkPerPlayer(mockState as ReduxState<any, any, any, any>);
            expect(result).toBe(true);
        });

        it('should return false for zones without an owner', () => {
            const checkPerPlayer = isPerPlayerZone('zone2');
            const result = checkPerPlayer(mockState as ReduxState<any, any, any, any>);
            expect(result).toBe(false);
        });

        it('should return false for non-existent zones', () => {
            const checkPerPlayer = isPerPlayerZone('nonExistent');
            const result = checkPerPlayer(mockState as ReduxState<any, any, any, any>);
            expect(result).toBe(false);
        });
    });
});
