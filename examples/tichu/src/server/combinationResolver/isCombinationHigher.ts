import { Card } from 'cardgameforge/server';
import { Combinations, TichuCard } from '../types';
import { COMBINATIONS } from '../constants';
import { countByValue } from './utils';

export const isCombinationHigher = (
    combinationType: Combinations,
    playedCards: Card<TichuCard>[],
    currentCombinationCards: Card<TichuCard>[]
): boolean =>
    combinationType === COMBINATIONS.FULL_HOUSE
        ? fullHouseResolver(playedCards, currentCombinationCards)
        : commonResolver(playedCards, currentCombinationCards);

const fullHouseResolver = (
    playedCards: Card<TichuCard>[],
    currentCombinationCards: Card<TichuCard>[]
): boolean => {
    const playedCardsCounts = Object.entries(countByValue(playedCards));
    const currentCombinationCounts = Object.entries(countByValue(currentCombinationCards));
    return (
        playedCardsCounts
            .filter(([_, count]) => count === 2)
            .map(([value, _]) => Number(value))[0] >
        currentCombinationCounts
            .filter(([_, count]) => count === 2)
            .map(([value, _]) => Number(value))[0]
    );
};

const commonResolver = (
    playedCards: Card<TichuCard>[],
    currentCombinationCards: Card<TichuCard>[]
): boolean => {
    return (
        playedCards[0].templateFields.custom!.value! >
        currentCombinationCards[0].templateFields.custom!.value!
    );
};
