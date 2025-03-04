import { getCardCollection } from '../getCardCollection';
import { ReduxState, CardTemplate, GameState } from '../../types';

describe('getCardCollection selector', () => {
    type CustomCard = {
        customField: string;
    };

    const mockCards: CardTemplate<CustomCard>[] = [
        {
            id: '1',
            name: 'Test Card 1',
            displayType: 'test',
            custom: {
                customField: 'value1',
            },
        },
        {
            id: '2',
            name: 'Test Card 2',
            displayType: 'test',
            custom: {
                customField: 'value2',
            },
        },
    ];

    const mockGameState: Partial<GameState<any, any, any, CustomCard>> = {
        coreState: {
            cardCollection: mockCards,
        } as GameState<any, any, any, CustomCard>['coreState'],
    };

    const mockState: ReduxState<any, any, any, CustomCard> = {
        game: {
            ...(mockGameState as GameState<any, any, any, CustomCard>),
        },
    };

    it('should return the card collection', () => {
        const selector = getCardCollection<CustomCard>();
        const result = selector(mockState as ReduxState<any, any, any, CustomCard>);

        expect(result).toEqual(mockCards);
        expect(result).toHaveLength(2);
        expect(result[0].custom!.customField).toBe('value1');
        expect(result[1].custom!.customField).toBe('value2');
    });

    it('should work with empty collection', () => {
        const emptyState = { ...mockState };
        emptyState.game.coreState.cardCollection = [];

        const selector = getCardCollection<CustomCard>();
        const result = selector(emptyState as ReduxState<any, any, any, CustomCard>);

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });
});
