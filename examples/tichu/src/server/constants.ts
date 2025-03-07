export const combinationsArray = ['SINGLE', 'TRIPLE', 'FULL_HOUSE', 'BOMB4'] as const;

export const COMBINATIONS = {
    SINGLE: 'SINGLE',
    PAIR: 'PAIR',
    TRIPLE: 'TRIPLE',
    FULL_HOUSE: 'FULL_HOUSE',
    STRAIGHT: 'STRAIGHT',
    BOMB4: 'BOMB4',
    BOMB_STRAIGHT: 'BOMB_STRAIGHT',
};

export const BOMBS = [COMBINATIONS.BOMB4, COMBINATIONS.BOMB_STRAIGHT];

export const GAME_PHASES = {
    SMALL_TICHU: 'SMALL_TICHU',
    BIG_TICHU: 'BIG_TICHU',
    SEND_CARDS: 'SEND_CARDS',
    PLAY_CARDS: 'PLAY_CARDS',
    SEND_DECK: 'SEND_DECK',
    TURN_END: 'TURN_END',
};

export const SPECIAL_CARDS = {
    DOG: 'DOG',
    PHOENIX: 'PHOENIX',
    DRAGON: 'DRAGON',
    MAHJONG: 'MAHJONG',
};

export const MOVES = {
    PLAY_CARDS: 'PLAY_CARDS',
    PASS: 'PASS',
    SEND_CARDS: 'SEND_CARDS',
    CALL_TICHU: 'CALL_TICHU',
    SEND_DECK: 'SEND_DECK',
};

export const ZONES = {
    HAND: 'HAND',
    COLLECTED: 'COLLECTED',
    START_DECK: 'START_DECK',
    PLAYED_CARDS: 'PLAYED_CARDS',
};

export const DEFAULT_PLAYED_COMBINATION = {
    cards: [],
    type: undefined,
    playedBy: undefined,
};

export const TYPES_OF_TICHU = {
    BIG: 'BIG',
    SMALL: 'SMALL',
};
