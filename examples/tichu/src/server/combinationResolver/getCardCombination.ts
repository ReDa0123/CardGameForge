import { Card } from 'cardgameforge/server';
import { Combinations, TichuCard } from '../types';
import { COMBINATIONS, SPECIAL_CARDS } from '../constants';
import {
    countByValue,
    areValuesConsecutive,
    getCardValues,
    sortByValue,
    splitEvery,
    unique,
    areCountValuesFullHouse,
} from './utils';

export const getCardCombination = (cards: Card<TichuCard>[]): Combinations | undefined => {
    const sortedCards = sortByValue(cards);
    if (sortedCards.length === 0) {
        return undefined;
    }
    if (sortedCards.length === 1) {
        return COMBINATIONS.SINGLE as Combinations;
    }
    if (isCombinationPair(sortedCards)) {
        const pairLength = sortedCards.length / 2;
        return `${COMBINATIONS.PAIR}_${pairLength}` as Combinations;
    }
    if (isCombinationTriple(sortedCards)) {
        return COMBINATIONS.TRIPLE as Combinations;
    }
    if (isCombinationFullHouse(sortedCards)) {
        return COMBINATIONS.FULL_HOUSE as Combinations;
    }
    if (isCombinationBomb4(sortedCards)) {
        return COMBINATIONS.BOMB4 as Combinations;
    }
    if (isCombinationStraight(sortedCards)) {
        const straightLength = sortedCards.length;
        if (isStraightBomb(sortedCards)) {
            return `${COMBINATIONS.BOMB_STRAIGHT}_${straightLength}` as Combinations;
        }
        return `${COMBINATIONS.STRAIGHT}_${straightLength}` as Combinations;
    }
    return undefined;
};

const isCombinationPair = (cards: Card<TichuCard>[]): boolean => {
    const values = getCardValues(cards);
    const length = values.length;
    const valuesSplitByTwo = splitEvery(2, values);
    const uniqueValues = unique(values);
    return (
        length % 2 === 0 &&
        length / 2 === uniqueValues.length &&
        valuesSplitByTwo.every((pair) => pair[0] === pair[1]) &&
        areValuesConsecutive(uniqueValues)
    );
};

const isCombinationTriple = (cards: Card<TichuCard>[]): boolean => {
    const values = getCardValues(cards);
    return values.length === 3 && values.every((value) => value === values[0]);
};

const isCombinationFullHouse = (cards: Card<TichuCard>[]): boolean => {
    const values = getCardValues(cards);
    const countByValues = Object.values(countByValue(cards));
    const uniqueValues = unique(values);
    return (
        values.length === 5 && uniqueValues.length === 2 && areCountValuesFullHouse(countByValues)
    );
};

const isCombinationBomb4 = (cards: Card<TichuCard>[]): boolean => {
    if (cards.some((card) => card.templateId === SPECIAL_CARDS.PHOENIX)) {
        return false;
    }
    const values = getCardValues(cards);
    const uniqueValues = unique(values);
    return values.length === 4 && uniqueValues.length === 1;
};

const isCombinationStraight = (cards: Card<TichuCard>[]): boolean => {
    const values = getCardValues(cards);
    const uniqueValues = unique(values);
    return (
        values.length >= 5 &&
        uniqueValues.length === values.length &&
        areValuesConsecutive(uniqueValues)
    );
};

const isStraightBomb = (cards: Card<TichuCard>[]): boolean => {
    const suits = cards.map((card) => card.templateFields.custom!.suit!);
    return suits.every((suit) => suit === suits[0]);
};
