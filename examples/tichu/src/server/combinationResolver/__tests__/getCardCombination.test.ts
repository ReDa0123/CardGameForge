import { Card } from 'cardgameforge/server';
import { TichuCard, CardSuit } from '../../types';
import { COMBINATIONS, SPECIAL_CARDS } from '../../constants';
import { getCardCombination } from '../getCardCombination';

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

const createPhoenixCard = (value: number): Card<TichuCard> => ({
    id: SPECIAL_CARDS.PHOENIX,
    templateId: SPECIAL_CARDS.PHOENIX,
    templateFields: {
        name: 'Phoenix',
        displayType: 'card',
        custom: {
            isSpecial: true,
            scoreValue: -25,
            value,
        },
    },
});

describe('getCardCombination', () => {
    describe('Empty and Invalid combinations', () => {
        it('should return undefined for empty cards array', () => {
            expect(getCardCombination([])).toBeUndefined();
        });

        it('should return undefined for invalid combination', () => {
            const cards = [createCard(2), createCard(5)];
            expect(getCardCombination(cards)).toBeUndefined();
        });
    });

    describe('SINGLE combinations', () => {
        it('should identify a single card', () => {
            const cards = [createCard(5)];
            expect(getCardCombination(cards)).toBe(COMBINATIONS.SINGLE);
        });
    });

    describe('PAIR combinations', () => {
        it('should identify a simple pair', () => {
            const cards = [createCard(5), createCard(5, 'BLACK')];
            expect(getCardCombination(cards)).toBe('PAIR_1');
        });

        it('should identify a consecutive pair', () => {
            const cards = [
                createCard(5),
                createCard(5, 'BLACK'),
                createCard(6),
                createCard(6, 'BLACK'),
                createCard(7),
                createCard(7, 'BLACK'),
            ];
            expect(getCardCombination(cards)).toBe('PAIR_3');
        });

        it('should not identify a non-consecutive pair', () => {
            const cards = [
                createCard(5),
                createCard(5, 'BLACK'),
                createCard(7),
                createCard(7, 'BLACK'),
            ];
            expect(getCardCombination(cards)).toBeUndefined();
        });
    });

    describe('TRIPLE combinations', () => {
        it('should identify a triple', () => {
            const cards = [createCard(5), createCard(5, 'BLACK'), createCard(5, 'GREEN')];
            expect(getCardCombination(cards)).toBe(COMBINATIONS.TRIPLE);
        });

        it('should not identify a triple with different values', () => {
            const cards = [createCard(5), createCard(5, 'BLACK'), createCard(6, 'GREEN')];
            expect(getCardCombination(cards)).toBeUndefined();
        });
    });

    describe('FULL_HOUSE combinations', () => {
        it('should identify a full house', () => {
            const cards = [
                createCard(5),
                createCard(5, 'BLACK'),
                createCard(5, 'GREEN'), // triple
                createCard(8),
                createCard(8, 'BLACK'), // pair
            ];
            expect(getCardCombination(cards)).toBe(COMBINATIONS.FULL_HOUSE);
        });

        it('should not identify a full house with wrong counts', () => {
            const cards = [
                createCard(5),
                createCard(5, 'BLACK'), // pair
                createCard(8),
                createCard(8, 'BLACK'),
                createCard(8, 'GREEN'),
                createCard(8, 'BLUE'), // four of a kind
            ];
            expect(getCardCombination(cards)).toBeUndefined();
        });

        it('should identify a full house with phoenix', () => {
            const cards = [
                createCard(5),
                createCard(5, 'GREEN'), // triple
                createCard(8),
                createCard(8, 'BLACK'), // pair
                createPhoenixCard(5),
            ];
            expect(getCardCombination(cards)).toBe(COMBINATIONS.FULL_HOUSE);
        });
    });

    describe('BOMB4 combinations', () => {
        it('should identify a bomb4', () => {
            const cards = [
                createCard(5),
                createCard(5, 'BLACK'),
                createCard(5, 'GREEN'),
                createCard(5, 'BLUE'),
            ];
            expect(getCardCombination(cards)).toBe(COMBINATIONS.BOMB4);
        });

        it('should not identify a bomb4 with phoenix', () => {
            const cards = [
                createCard(5),
                createCard(5, 'BLACK'),
                createCard(5, 'GREEN'),
                createPhoenixCard(5),
            ];
            expect(getCardCombination(cards)).toBeUndefined();
        });
    });

    describe('STRAIGHT combinations', () => {
        it('should identify a regular straight', () => {
            const cards = [
                createCard(2, 'RED'),
                createCard(3, 'GREEN'),
                createCard(4, 'BLUE'),
                createCard(5, 'BLACK'),
                createCard(6, 'RED'),
            ];
            expect(getCardCombination(cards)).toBe('STRAIGHT_5');
        });

        it('should identify a longer straight', () => {
            const cards = [
                createCard(2, 'RED'),
                createCard(3, 'GREEN'),
                createCard(4, 'BLUE'),
                createCard(5, 'BLACK'),
                createCard(6, 'RED'),
                createCard(7, 'GREEN'),
                createCard(8, 'BLUE'),
            ];
            expect(getCardCombination(cards)).toBe('STRAIGHT_7');
        });

        it('should not identify a broken straight', () => {
            const cards = [
                createCard(2, 'RED'),
                createCard(2, 'GREEN'),
                createCard(4, 'BLUE'),
                createCard(5, 'BLACK'),
                createCard(6, 'RED'),
            ];
            expect(getCardCombination(cards)).toBeUndefined();
        });

        it('should not identify a straight less than 5 cards', () => {
            const cards = [
                createCard(2, 'RED'),
                createCard(3, 'GREEN'),
                createCard(4, 'BLUE'),
                createCard(5, 'BLACK'),
            ];
            expect(getCardCombination(cards)).toBeUndefined();
        });
    });

    describe('BOMB_STRAIGHT combinations', () => {
        it('should identify a straight bomb of same suit', () => {
            const cards = [
                createCard(2, 'RED'),
                createCard(3, 'RED'),
                createCard(4, 'RED'),
                createCard(5, 'RED'),
                createCard(6, 'RED'),
            ];
            expect(getCardCombination(cards)).toBe('BOMB_STRAIGHT_5');
        });

        it('should not identify a straight bomb with mixed suits', () => {
            const cards = [
                createCard(2, 'RED'),
                createCard(3, 'RED'),
                createCard(4, 'BLACK'),
                createCard(5, 'RED'),
                createCard(6, 'RED'),
            ];
            expect(getCardCombination(cards)).toBe('STRAIGHT_5');
        });

        it('should identify a longer straight bomb', () => {
            const cards = [
                createCard(2, 'RED'),
                createCard(3, 'RED'),
                createCard(4, 'RED'),
                createCard(5, 'RED'),
                createCard(6, 'RED'),
                createCard(7, 'RED'),
                createCard(8, 'RED'),
            ];
            expect(getCardCombination(cards)).toBe('BOMB_STRAIGHT_7');
        });
    });
});
