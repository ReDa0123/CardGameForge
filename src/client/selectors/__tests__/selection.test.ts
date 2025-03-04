import { getSelection, getSelectedCardsInZone } from '../selection';
import { GameState, ReduxState, Selection } from '../../types';

describe('selection selectors', () => {
    const mockSelection: Selection = {
        zone1: ['card1', 'card2'],
        zone2: ['card3'],
        emptyZone: [],
    };

    const mockGameState: Partial<GameState<any, any, any, any>> = {
        coreState: {
            selection: mockSelection,
        } as GameState<any, any, any, any>['coreState'],
    };

    const mockState: ReduxState<any, any, any, any> = {
        game: {
            ...(mockGameState as GameState<any, any, any, any>),
        },
    };

    describe('getSelection', () => {
        it('should return the complete selection state', () => {
            const result = getSelection(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual(mockSelection);
        });
    });

    describe('getSelectedCardsInZone', () => {
        it('should return selected cards for a specific zone', () => {
            const getZone1Cards = getSelectedCardsInZone('zone1');
            const result = getZone1Cards(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual(['card1', 'card2']);
        });

        it('should return empty array for zone with no selections', () => {
            const getEmptyZoneCards = getSelectedCardsInZone('emptyZone');
            const result = getEmptyZoneCards(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual([]);
        });

        it('should return empty array for non-existent zone', () => {
            const getNonExistentZoneCards = getSelectedCardsInZone('nonExistentZone');
            const result = getNonExistentZoneCards(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual([]);
        });
    });
});
