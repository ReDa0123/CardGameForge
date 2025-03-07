import { Combinations } from '../types';

export const isPlayedCombinationSameOrBombed = (
    playedCombination: Combinations,
    currentCombination: Combinations
): {
    canBePlayed: boolean;
    isBombedOver?: boolean;
} => {
    if (playedCombination === currentCombination) {
        return { canBePlayed: true };
    }
    if (playedCombination.includes('BOMB')) {
        if (!currentCombination.includes('BOMB')) {
            return { canBePlayed: true, isBombedOver: true };
        }
        const isPlayedCombinationStraightBomb = playedCombination.includes('STRAIGHT');
        const isCurrentCombinationStraightBomb = currentCombination.includes('STRAIGHT');
        if (isPlayedCombinationStraightBomb && !isCurrentCombinationStraightBomb) {
            return { canBePlayed: true, isBombedOver: true };
        }
        if (!isPlayedCombinationStraightBomb && isCurrentCombinationStraightBomb) {
            return { canBePlayed: false };
        }
        const playedStraightLength = Number(playedCombination.split('_')[2]);
        const currentStraightLength = Number(currentCombination.split('_')[2]);
        if (playedStraightLength > currentStraightLength) {
            return { canBePlayed: true, isBombedOver: true };
        }
        return { canBePlayed: false };
    }
    return { canBePlayed: false };
};
