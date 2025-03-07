import { combinationsArray } from './constants';
import { Card, TurnOrder } from 'cardgameforge/server';

export type Combinations =
    | typeof combinationsArray[number]
    | `STRAIGHT_${number}`
    | `BOMB_STRAIGHT_${number}`
    | `PAIR_${number}`;

type Score = {
    teamId: string;
    score: number;
};

export type Scores = {
    team1?: Score;
    team2?: Score;
};

export type TypeOfTichu = 'BIG' | 'SMALL' | false;

export type Tichus = {
    [playerId: string]: TypeOfTichu;
};

export type SentCards = {
    [playerId: string]: Card<TichuCard>[];
};

export type TichuState = {
    numberOfPasses: number;
    finishedPlayers: string[];
    calledTichu: Tichus;
    hasCalledTichu: string[];
    score: Scores;
    playedCombination: {
        cards: Card<TichuCard>[];
        type?: Combinations;
        playedBy?: string;
    };
    sentCards: SentCards;
    hasSentCards: string[];
    originalPlayOrder: TurnOrder['playOrder'];
};

export type TichuGameSettings = {
    scoreToWin: number;
};

export type CardSuit = 'RED' | 'GREEN' | 'BLUE' | 'BLACK';

export type TichuCard = {
    value?: number;
    suit?: CardSuit;
    isSpecial: boolean;
    scoreValue: number;
};
