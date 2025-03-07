import { Card } from 'cardgameforge/server';
import { TichuCard, CardSuit, Combinations } from '../../types';
import { COMBINATIONS } from '../../constants';
import { isCombinationHigher } from '../isCombinationHigher';

const createCard = (value: number, suit: CardSuit = 'RED'): Card<TichuCard> => ({
    id: `${value}-${suit}`,
    templateId: `${value}-${suit}`,
    templateFields: {
        name: `${value} of ${suit}`,
        displayType: 'card',
        custom: {
            value,
            suit,
            isSpecial: false,
            scoreValue: value,
        },
    },
});

describe('isCombinationHigher', () => {
    describe('SINGLE cards', () => {
        it('should return true when played card is higher', () => {
            const playedCards = [createCard(10)];
            const currentCards = [createCard(5)];

            expect(
                isCombinationHigher(COMBINATIONS.SINGLE as Combinations, playedCards, currentCards)
            ).toBe(true);
        });

        it('should return false when played card is lower', () => {
            const playedCards = [createCard(3)];
            const currentCards = [createCard(8)];

            expect(
                isCombinationHigher(COMBINATIONS.SINGLE as Combinations, playedCards, currentCards)
            ).toBe(false);
        });

        it('should return false when played card is the same value', () => {
            const playedCards = [createCard(3)];
            const currentCards = [createCard(3)];

            expect(
                isCombinationHigher(COMBINATIONS.SINGLE as Combinations, playedCards, currentCards)
            ).toBe(false);
        });
    });

    describe('PAIR combinations', () => {
        it('should return true when played pair is higher', () => {
            const playedCards = [createCard(10), createCard(10, 'BLACK')];
            const currentCards = [createCard(5), createCard(5, 'BLACK')];

            expect(
                isCombinationHigher(COMBINATIONS.PAIR as Combinations, playedCards, currentCards)
            ).toBe(true);
        });

        it('should return false when played pair is lower', () => {
            const playedCards = [createCard(3), createCard(3, 'BLACK')];
            const currentCards = [createCard(8), createCard(8, 'BLACK')];

            expect(
                isCombinationHigher(COMBINATIONS.PAIR as Combinations, playedCards, currentCards)
            ).toBe(false);
        });

        it('should return false when played pair is the same value', () => {
            const playedCards = [createCard(3), createCard(3, 'BLACK')];
            const currentCards = [createCard(3), createCard(3, 'BLACK')];

            expect(
                isCombinationHigher(COMBINATIONS.PAIR as Combinations, playedCards, currentCards)
            ).toBe(false);
        });
    });

    describe('TRIPLE combinations', () => {
        it('should return true when played triple is higher', () => {
            const playedCards = [createCard(10), createCard(10, 'BLACK'), createCard(10, 'GREEN')];
            const currentCards = [createCard(5), createCard(5, 'BLACK'), createCard(5, 'GREEN')];

            expect(
                isCombinationHigher(COMBINATIONS.TRIPLE as Combinations, playedCards, currentCards)
            ).toBe(true);
        });

        it('should return false when played triple is lower', () => {
            const playedCards = [createCard(3), createCard(3, 'BLACK'), createCard(3, 'GREEN')];
            const currentCards = [createCard(8), createCard(8, 'BLACK'), createCard(8, 'GREEN')];

            expect(
                isCombinationHigher(COMBINATIONS.TRIPLE as Combinations, playedCards, currentCards)
            ).toBe(false);
        });
    });

    describe('FULL_HOUSE combinations', () => {
        it('should return true when played full house pair is higher', () => {
            const playedCards = [
                createCard(10),
                createCard(10, 'BLACK'), // pair
                createCard(5),
                createCard(5, 'BLACK'),
                createCard(5, 'GREEN'), // triple
            ];
            const currentCards = [
                createCard(8),
                createCard(8, 'BLACK'), // pair
                createCard(12),
                createCard(12, 'BLACK'),
                createCard(12, 'GREEN'), // triple
            ];

            expect(
                isCombinationHigher(
                    COMBINATIONS.FULL_HOUSE as Combinations,
                    playedCards,
                    currentCards
                )
            ).toBe(true);
        });

        it('should return false when played full house pair is lower', () => {
            const playedCards = [
                createCard(3),
                createCard(3, 'BLACK'), // pair
                createCard(12),
                createCard(12, 'BLACK'),
                createCard(12, 'GREEN'), // triple
            ];
            const currentCards = [
                createCard(8),
                createCard(8, 'BLACK'), // pair
                createCard(5),
                createCard(5, 'BLACK'),
                createCard(5, 'GREEN'), // triple
            ];

            expect(
                isCombinationHigher(
                    COMBINATIONS.FULL_HOUSE as Combinations,
                    playedCards,
                    currentCards
                )
            ).toBe(false);
        });

        it('should return false when played full house pair is the same value', () => {
            const playedCards = [
                createCard(3),
                createCard(3, 'BLACK'), // pair
                createCard(11),
                createCard(11, 'BLACK'),
                createCard(11, 'GREEN'), // triple
            ];
            const currentCards = [
                createCard(3),
                createCard(3, 'BLACK'), // pair
                createCard(12),
                createCard(12, 'BLACK'),
                createCard(12, 'GREEN'), // triple
            ];

            expect(
                isCombinationHigher(
                    COMBINATIONS.FULL_HOUSE as Combinations,
                    playedCards,
                    currentCards
                )
            ).toBe(false);
        });
    });

    describe('STRAIGHT combinations', () => {
        const STRAIGHT_5 = 'STRAIGHT_5' as `STRAIGHT_${number}`;

        it('should return true when played straight is higher', () => {
            const playedCards = [
                createCard(6),
                createCard(7),
                createCard(8),
                createCard(9),
                createCard(10),
            ];
            const currentCards = [
                createCard(2),
                createCard(3),
                createCard(4),
                createCard(5),
                createCard(6),
            ];

            expect(isCombinationHigher(STRAIGHT_5, playedCards, currentCards)).toBe(true);
        });

        it('should return false when played straight is lower', () => {
            const playedCards = [
                createCard(2),
                createCard(3),
                createCard(4),
                createCard(5),
                createCard(6),
            ];
            const currentCards = [
                createCard(6),
                createCard(7),
                createCard(8),
                createCard(9),
                createCard(10),
            ];

            expect(isCombinationHigher(STRAIGHT_5, playedCards, currentCards)).toBe(false);
        });

        it('should return false when played straight is same', () => {
            const playedCards = [
                createCard(2),
                createCard(3),
                createCard(4),
                createCard(5),
                createCard(6),
            ];
            const currentCards = [
                createCard(2),
                createCard(3),
                createCard(4),
                createCard(5),
                createCard(6),
            ];

            expect(isCombinationHigher(STRAIGHT_5, playedCards, currentCards)).toBe(false);
        });
    });

    describe('BOMB4 combinations', () => {
        it('should return true when played bomb4 is higher', () => {
            const playedCards = [
                createCard(10),
                createCard(10, 'BLACK'),
                createCard(10, 'GREEN'),
                createCard(10, 'BLUE'),
            ];
            const currentCards = [
                createCard(5),
                createCard(5, 'BLACK'),
                createCard(5, 'GREEN'),
                createCard(5, 'BLUE'),
            ];

            expect(
                isCombinationHigher(COMBINATIONS.BOMB4 as Combinations, playedCards, currentCards)
            ).toBe(true);
        });

        it('should return false when played bomb4 is lower', () => {
            const playedCards = [
                createCard(3),
                createCard(3, 'BLACK'),
                createCard(3, 'GREEN'),
                createCard(3, 'BLUE'),
            ];
            const currentCards = [
                createCard(8),
                createCard(8, 'BLACK'),
                createCard(8, 'GREEN'),
                createCard(8, 'BLUE'),
            ];

            expect(
                isCombinationHigher(COMBINATIONS.BOMB4 as Combinations, playedCards, currentCards)
            ).toBe(false);
        });
    });

    describe('BOMB_STRAIGHT combinations', () => {
        const BOMB_STRAIGHT_5 = 'BOMB_STRAIGHT_5' as `BOMB_STRAIGHT_${number}`;

        it('should return true when played bomb straight is higher', () => {
            const playedCards = [
                createCard(6),
                createCard(7),
                createCard(8),
                createCard(9),
                createCard(10),
            ];
            const currentCards = [
                createCard(2),
                createCard(3),
                createCard(4),
                createCard(5),
                createCard(6),
            ];

            expect(isCombinationHigher(BOMB_STRAIGHT_5, playedCards, currentCards)).toBe(true);
        });

        it('should return false when played bomb straight is lower', () => {
            const playedCards = [
                createCard(2),
                createCard(3),
                createCard(4),
                createCard(5),
                createCard(6),
            ];
            const currentCards = [
                createCard(6),
                createCard(7),
                createCard(8),
                createCard(9),
                createCard(10),
            ];

            expect(isCombinationHigher(BOMB_STRAIGHT_5, playedCards, currentCards)).toBe(false);
        });
    });
});
