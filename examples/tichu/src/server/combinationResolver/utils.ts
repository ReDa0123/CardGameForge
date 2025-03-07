import { TichuCard } from '../types';
import { Card } from 'cardgameforge/server';

export const countByValue = (cards: Card<TichuCard>[]) => {
    const sortedCards = sortByValue(cards);
    return sortedCards.reduce((acc, card) => {
        acc[card.templateFields.custom!.value!] =
            (acc[card.templateFields.custom!.value!] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);
};

export const sortByValue = (cards: Card<TichuCard>[]) => {
    return [...cards].sort(
        (a, b) => a.templateFields.custom!.value! - b.templateFields.custom!.value!
    );
};

export const getCardValues = (cards: Card<TichuCard>[]) => {
    return cards.map((card) => card.templateFields.custom!.value!);
};

export const splitEvery = <T>(n: number, arr: T[]): T[][] => {
    return arr.reduce((acc, card, i) => {
        const index = Math.floor(i / n);
        acc[index] = [...(acc[index] || []), card];
        return acc;
    }, [] as T[][]);
};

export const unique = <T>(arr: T[]): T[] => {
    return [...new Set(arr)];
};

export const areValuesConsecutive = (values: number[]): boolean => {
    const sortedValues = [...values].sort((a, b) => a - b);
    return sortedValues.every((value, index) => value === sortedValues[0] + index);
};

export const areCountValuesFullHouse = (countByValues: number[]): boolean => {
    const sortedCountByValues = [...countByValues].sort((a, b) => a - b);
    return sortedCountByValues[0] === 2 && sortedCountByValues[1] === 3;
};
