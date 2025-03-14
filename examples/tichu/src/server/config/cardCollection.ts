import { CardSuit, TichuCard, TichuGameSettings, TichuState } from '../types';
import { CardTemplate, Metadata, StateContext } from 'cardgameforge/server/types';
import { COMBINATIONS, MOVES, SPECIAL_CARDS, ZONES } from '../constants';
import { findPlayersHandId, getNextPlayerNotFinished, getTeammateIdFromTeam } from './utils';
import { actionTypes, SetActivePlayerPayload, ChangeZonePayload } from 'cardgameforge/server';
import { PlayCardsPayload } from './moves';

const NUMBERS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const suits: CardSuit[] = ['RED', 'GREEN', 'BLUE', 'BLACK'];

export const VALUES = {
    [NUMBERS[0]]: 2,
    [NUMBERS[1]]: 3,
    [NUMBERS[2]]: 4,
    [NUMBERS[3]]: 5,
    [NUMBERS[4]]: 6,
    [NUMBERS[5]]: 7,
    [NUMBERS[6]]: 8,
    [NUMBERS[7]]: 9,
    [NUMBERS[8]]: 10,
    [NUMBERS[9]]: 11,
    [NUMBERS[10]]: 12,
    [NUMBERS[11]]: 13,
    [NUMBERS[12]]: 14,
};

const getScoreValue = (number: string) => {
    if (number === '5') return 5;
    if (number === '10' || number === 'K') return 10;
    return 0;
};

const notSpecialCards: CardTemplate<TichuCard>[] = NUMBERS.map((number) => {
    return suits.map(
        (suit): CardTemplate<TichuCard> => ({
            id: `${suit}-${number}`,
            name: `${number} ${suit}`,
            displayType: 'card',
            custom: {
                isSpecial: false,
                value: VALUES[number],
                suit,
                scoreValue: getScoreValue(number),
            },
        })
    );
}).flat();

const dogCard: CardTemplate<TichuCard> = {
    id: SPECIAL_CARDS.DOG,
    name: 'Dog',
    displayType: 'card',
    custom: {
        isSpecial: true,
        scoreValue: 0,
    },
    moves: {
        [MOVES.PLAY_CARDS]: {
            canExecute: (
                { cardIds }: PlayCardsPayload,
                ctx: StateContext<TichuState, TichuGameSettings, any, TichuCard>
            ): { canExecute: boolean; reason?: string } => {
                const { zones } = ctx.getState().coreState;
                if (cardIds.length !== 1) {
                    return { canExecute: false, reason: 'Dog can only be played as single card.' };
                }
                const canExecute = zones[ZONES.PLAYED_CARDS].cards.length === 0;
                return {
                    canExecute,
                    reason: canExecute ? undefined : 'Dog can be played only as a first card',
                };
            },
            execute: (
                { cardIds }: PlayCardsPayload,
                ctx: StateContext<TichuState, TichuGameSettings, any, TichuCard>,
                __: string,
                meta: Metadata
            ) => {
                const playerId = meta.playerId!;
                const teamId = meta.teamId!;

                const gameState = ctx.getState();
                const zones = gameState.coreState.zones;
                const teams = gameState.coreState.teams!;
                const teammateId = getTeammateIdFromTeam(teams, teamId, playerId);
                const originalPlayOrder = gameState.customState.originalPlayOrder;
                const finished = gameState.customState.finishedPlayers;
                const isTeammateFinished = finished.includes(teammateId);
                const newActivePlayer = isTeammateFinished
                    ? getNextPlayerNotFinished(originalPlayOrder, teammateId, finished)
                    : teammateId;
                const zonesArr = Object.values(zones);
                const playersHandId = findPlayersHandId(zonesArr, playerId);
                ctx.dispatchAction<ChangeZonePayload>(
                    actionTypes.CHANGE_ZONE,
                    {
                        cardIds,
                        fromZoneId: playersHandId,
                        toZoneId: ZONES.PLAYED_CARDS,
                    },
                    meta
                );
                ctx.dispatchAction<SetActivePlayerPayload>(
                    actionTypes.SET_ACTIVE_PLAYER,
                    { playerId: newActivePlayer },
                    meta
                );
            },
        },
    },
};

const mahjongCard: CardTemplate<TichuCard> = {
    id: SPECIAL_CARDS.MAHJONG,
    name: 'Mahjong',
    displayType: 'card',
    custom: {
        isSpecial: true,
        scoreValue: 0,
        value: 1,
    },
};

const phoenixCard: CardTemplate<TichuCard> = {
    id: SPECIAL_CARDS.PHOENIX,
    name: 'Phoenix',
    displayType: 'card',
    custom: {
        isSpecial: true,
        scoreValue: -25,
    },
};

const dragonCard: CardTemplate<TichuCard> = {
    id: SPECIAL_CARDS.DRAGON,
    name: 'Dragon',
    displayType: 'card',
    custom: {
        isSpecial: true,
        scoreValue: 25,
        value: 25,
    },
    moves: {
        [MOVES.PLAY_CARDS]: {
            canExecute: (
                { cardIds }: PlayCardsPayload,
                ctx: StateContext<TichuState, TichuGameSettings, any, TichuCard>
            ): { canExecute: boolean; reason?: string } => {
                const currentCombination = ctx.getState().customState.playedCombination.type;
                if (
                    (!currentCombination || currentCombination === COMBINATIONS.SINGLE) &&
                    cardIds.length === 1
                ) {
                    return { canExecute: true };
                }
                return { canExecute: false, reason: 'Dragon can only be player as a single card' };
            },
            execute: () => {},
        },
    },
};

export const cardCollection: CardTemplate<TichuCard>[] = [
    ...notSpecialCards,
    dogCard,
    mahjongCard,
    phoenixCard,
    dragonCard,
];
