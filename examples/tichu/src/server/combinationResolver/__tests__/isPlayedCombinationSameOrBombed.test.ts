import { Combinations } from '../../types';
import { COMBINATIONS } from '../../constants';
import { isPlayedCombinationSameOrBombed } from '../isPlayedCombinationSameOrBombed';

const canBePLayedNoBomb = {
    canBePlayed: true,
};

const canBePLayedBomb = {
    canBePlayed: true,
    isBombedOver: true,
};

const cannotBePlayed = {
    canBePlayed: false,
};

describe('isPlayedCombinationSameOrBombed', () => {
    describe('Same combinations', () => {
        it('should return true for identical combinations', () => {
            expect(
                isPlayedCombinationSameOrBombed(
                    COMBINATIONS.SINGLE as Combinations,
                    COMBINATIONS.SINGLE as Combinations
                )
            ).toEqual(canBePLayedNoBomb);
            const pair1: Combinations = 'PAIR_1';
            expect(isPlayedCombinationSameOrBombed(pair1, pair1)).toEqual(canBePLayedNoBomb);
            expect(
                isPlayedCombinationSameOrBombed(
                    COMBINATIONS.TRIPLE as Combinations,
                    COMBINATIONS.TRIPLE as Combinations
                )
            ).toEqual(canBePLayedNoBomb);
            expect(
                isPlayedCombinationSameOrBombed(
                    COMBINATIONS.FULL_HOUSE as Combinations,
                    COMBINATIONS.FULL_HOUSE as Combinations
                )
            ).toEqual(canBePLayedNoBomb);
        });

        it('should return true for identical straight combinations', () => {
            const straight5: Combinations = 'STRAIGHT_5';
            expect(isPlayedCombinationSameOrBombed(straight5, straight5)).toEqual(
                canBePLayedNoBomb
            );
        });

        it('should return false for different straight combinations', () => {
            const straight5: Combinations = 'STRAIGHT_5';
            const straight6: Combinations = 'STRAIGHT_6';
            expect(isPlayedCombinationSameOrBombed(straight5, straight6)).toEqual(cannotBePlayed);
        });

        it('should return true for identical bomb combinations', () => {
            expect(
                isPlayedCombinationSameOrBombed(
                    COMBINATIONS.BOMB4 as Combinations,
                    COMBINATIONS.BOMB4 as Combinations
                )
            ).toEqual(canBePLayedNoBomb);

            const bombStraight5: Combinations = 'BOMB_STRAIGHT_5';
            expect(isPlayedCombinationSameOrBombed(bombStraight5, bombStraight5)).toEqual(
                canBePLayedNoBomb
            );
        });
    });

    describe('Regular vs Bomb combinations', () => {
        it('should return true when played combination is BOMB4 vs regular combination', () => {
            expect(
                isPlayedCombinationSameOrBombed(
                    COMBINATIONS.BOMB4 as Combinations,
                    COMBINATIONS.SINGLE as Combinations
                )
            ).toEqual(canBePLayedBomb);
            expect(
                isPlayedCombinationSameOrBombed(COMBINATIONS.BOMB4 as Combinations, 'PAIR_1')
            ).toEqual(canBePLayedBomb);
            expect(
                isPlayedCombinationSameOrBombed(
                    COMBINATIONS.BOMB4 as Combinations,
                    COMBINATIONS.TRIPLE as Combinations
                )
            ).toEqual(canBePLayedBomb);
            expect(
                isPlayedCombinationSameOrBombed(
                    COMBINATIONS.BOMB4 as Combinations,
                    COMBINATIONS.FULL_HOUSE as Combinations
                )
            ).toEqual(canBePLayedBomb);
            expect(
                isPlayedCombinationSameOrBombed(COMBINATIONS.BOMB4 as Combinations, 'STRAIGHT_14')
            ).toEqual(canBePLayedBomb);
        });

        it('should return true when played combination is straight bomb vs regular combination', () => {
            const bombStraight5: Combinations = 'BOMB_STRAIGHT_5';
            expect(
                isPlayedCombinationSameOrBombed(bombStraight5, COMBINATIONS.SINGLE as Combinations)
            ).toEqual(canBePLayedBomb);
            expect(isPlayedCombinationSameOrBombed(bombStraight5, 'PAIR_1')).toEqual(
                canBePLayedBomb
            );
            expect(
                isPlayedCombinationSameOrBombed(bombStraight5, COMBINATIONS.TRIPLE as Combinations)
            ).toEqual(canBePLayedBomb);
            expect(
                isPlayedCombinationSameOrBombed(
                    bombStraight5,
                    COMBINATIONS.FULL_HOUSE as Combinations
                )
            ).toEqual(canBePLayedBomb);
            expect(isPlayedCombinationSameOrBombed(bombStraight5, 'STRAIGHT_5')).toEqual(
                canBePLayedBomb
            );
        });

        it('should return false when regular combination vs BOMB4', () => {
            expect(
                isPlayedCombinationSameOrBombed(
                    COMBINATIONS.SINGLE as Combinations,
                    COMBINATIONS.BOMB4 as Combinations
                )
            ).toEqual(cannotBePlayed);
            expect(
                isPlayedCombinationSameOrBombed('PAIR_1', COMBINATIONS.BOMB4 as Combinations)
            ).toEqual(cannotBePlayed);
            expect(
                isPlayedCombinationSameOrBombed(
                    COMBINATIONS.TRIPLE as Combinations,
                    COMBINATIONS.BOMB4 as Combinations
                )
            ).toEqual(cannotBePlayed);
            expect(
                isPlayedCombinationSameOrBombed(
                    COMBINATIONS.FULL_HOUSE as Combinations,
                    COMBINATIONS.BOMB4 as Combinations
                )
            ).toEqual(cannotBePlayed);
            expect(
                isPlayedCombinationSameOrBombed('STRAIGHT_12', COMBINATIONS.BOMB4 as Combinations)
            ).toEqual(cannotBePlayed);
        });
    });

    describe('Bomb hierarchy', () => {
        it('should return true when straight bomb vs BOMB4', () => {
            const bombStraight5: Combinations = 'BOMB_STRAIGHT_5';
            expect(
                isPlayedCombinationSameOrBombed(bombStraight5, COMBINATIONS.BOMB4 as Combinations)
            ).toEqual(canBePLayedBomb);
        });

        it('should return false when BOMB4 vs straight bomb', () => {
            const bombStraight5: Combinations = 'BOMB_STRAIGHT_5';
            expect(
                isPlayedCombinationSameOrBombed(COMBINATIONS.BOMB4 as Combinations, bombStraight5)
            ).toEqual(cannotBePlayed);
        });

        it('should return true when longer straight bomb vs shorter straight bomb', () => {
            const bombStraight6: Combinations = 'BOMB_STRAIGHT_6';
            const bombStraight5: Combinations = 'BOMB_STRAIGHT_5';
            expect(isPlayedCombinationSameOrBombed(bombStraight6, bombStraight5)).toEqual(
                canBePLayedBomb
            );
        });

        it('should return false when shorter straight bomb vs longer straight bomb', () => {
            const bombStraight6: Combinations = 'BOMB_STRAIGHT_6';
            const bombStraight5: Combinations = 'BOMB_STRAIGHT_5';
            expect(isPlayedCombinationSameOrBombed(bombStraight5, bombStraight6)).toEqual(
                cannotBePlayed
            );
        });
    });

    describe('Different non-bomb combinations', () => {
        it('should return false for different regular combinations', () => {
            expect(
                isPlayedCombinationSameOrBombed(COMBINATIONS.SINGLE as Combinations, 'PAIR_1')
            ).toEqual(cannotBePlayed);
            expect(
                isPlayedCombinationSameOrBombed('PAIR_1', COMBINATIONS.TRIPLE as Combinations)
            ).toEqual(cannotBePlayed);
            expect(
                isPlayedCombinationSameOrBombed(
                    COMBINATIONS.TRIPLE as Combinations,
                    COMBINATIONS.FULL_HOUSE as Combinations
                )
            ).toEqual(cannotBePlayed);
            expect(
                isPlayedCombinationSameOrBombed(
                    COMBINATIONS.FULL_HOUSE as Combinations,
                    'STRAIGHT_5'
                )
            ).toEqual(cannotBePlayed);
        });

        it('should return false for different straight lengths', () => {
            const straight5: Combinations = 'STRAIGHT_5';
            const straight6: Combinations = 'STRAIGHT_6';
            expect(isPlayedCombinationSameOrBombed(straight5, straight6)).toEqual(cannotBePlayed);
            expect(isPlayedCombinationSameOrBombed(straight6, straight5)).toEqual(cannotBePlayed);
        });
    });
});
