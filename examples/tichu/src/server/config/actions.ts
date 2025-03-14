import { ActionTemplate, Card, Zone } from 'cardgameforge/server';
import {
    TichuState,
    TichuGameSettings,
    TichuCard,
    TypeOfTichu,
    Scores,
    Combinations,
} from '../types';
import { DEFAULT_PLAYED_COMBINATION, SPECIAL_CARDS, ZONES } from '../constants';
import { EVERYBODY } from 'cardgameforge/server';

export const tichuActions = {
    ADD_NUMBER_OF_PASSES: 'ADD_NUMBER_OF_PASSES',
    RESET_NUMBER_OF_PASSES: 'RESET_NUMBER_OF_PASSES',
    SET_DEFAULT_CUSTOM_STATE: 'SET_DEFAULT_CUSTOM_STATE',
    SET_ORIGINAL_PLAY_ORDER: 'SET_ORIGINAL_PLAY_ORDER',
    ADD_FINISHED_PLAYER: 'ADD_FINISHED_PLAYER',
    CLEAR_FINISHED_PLAYERS: 'CLEAR_FINISHED_PLAYERS',
    SET_SCORE: 'SET_SCORE',
    ADD_SCORE_FOR_TEAM: 'ADD_SCORE_FOR_TEAM',
    SET_PLAYED_COMBINATION: 'SET_PLAYED_COMBINATION',
    RESET_PLAYED_COMBINATION: 'RESET_PLAYED_COMBINATION',
    SET_SENT_CARDS_FOR_PLAYER: 'SET_SENT_CARDS_FOR_PLAYER',
    RESET_ALL_SENT_CARDS: 'RESET_ALL_SENT_CARDS',
    SET_CALLED_TICHU_FOR_PLAYER: 'SET_CALLED_TICHU_FOR_PLAYER',
    RESET_CALLED_TICHUS: 'RESET_CALLED_TICHUS',
    ADD_HAS_SENT_CARDS: 'ADD_HAS_SENT_CARDS',
    CLEAR_HAS_SENT_CARDS: 'CLEAR_HAS_SENT_CARDS',
    ADD_HAS_CALLED_TICHU: 'ADD_HAS_CALLED_TICHU',
    CLEAR_HAS_CALLED_TICHU: 'CLEAR_HAS_CALLED_TICHU',
    PREPARE_FOR_NEW_ROUND: 'PREPARE_FOR_NEW_ROUND',
};

export type SetDefaultCustomStatePayload = object;
export type ResetNumberOfPassesPayload = object;
export type SetOriginalPlayOrderPayload = {
    playOrder: string[];
};
export type AddNumberOfPassesPayload = {
    numberOfPasses: number;
};
export type AddFinishedPlayerPayload = {
    playerId: string;
};
export type ClearFinishedPlayersPayload = object;
export type SetScorePayload = {
    score: Scores;
};
export type AddScoreForTeamPayload = {
    teamId: string;
    score: number;
};
export type SetPlayedCombinationPayload = {
    cards: Card<TichuCard>[];
    type: Combinations;
    playedBy: string;
};
export type ResetPlayedCombinationPayload = object;
export type SetSentCardsForPlayerPayload = {
    playerId: string;
    cards: Card<TichuCard>[];
};
export type ResetAllSentCardsPayload = object;
export type SetCalledTichuForPlayerPayload = {
    playerId: string;
    calledTichu: TypeOfTichu;
};
export type ResetCalledTichusPayload = object;
export type AddHasCalledTichuPayload = {
    playerId: string;
};
export type ClearHasCalledTichuPayload = object;
export type AddHasSentCardsPayload = {
    playerId: string;
};
export type ClearHasSentCardsPayload = object;
export type PrepareForNewRoundPayload = object;

const createObjectWithKeyPlayerIds = <T>(playerIds: string[], value: T) => {
    return playerIds.reduce((acc, playerId) => {
        acc[playerId] = value;
        return acc;
    }, {} as { [playerId: string]: T });
};

export const setDefaultCustomState: ActionTemplate<
    SetDefaultCustomStatePayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.SET_DEFAULT_CUSTOM_STATE,
    apply: (_, ctx) => {
        const state = ctx.getState();
        const playerIds = state.networkState!.players.map((p) => p.playerId);

        const calledTichu = createObjectWithKeyPlayerIds<TypeOfTichu>(playerIds, false);
        const teamIds = Object.keys(state.coreState.teams!);
        const score: Scores = {
            team1: {
                teamId: teamIds[0],
                score: 0,
            },
            team2: {
                teamId: teamIds[1],
                score: 0,
            },
        };
        const sentCards = createObjectWithKeyPlayerIds<Card<TichuCard>[]>(playerIds, []);

        const newCustomState: TichuState = {
            ...state.customState,
            calledTichu,
            score,
            sentCards,
        };

        return { ...state, customState: newCustomState };
    },
};

export const setOriginalPlayOrder: ActionTemplate<
    SetOriginalPlayOrderPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.SET_ORIGINAL_PLAY_ORDER,
    apply: (payload, ctx) => {
        const state = ctx.getState();
        return {
            ...state,
            customState: {
                ...state.customState,
                originalPlayOrder: payload.playOrder,
            },
        };
    },
};

export const addNumberOfPasses: ActionTemplate<
    AddNumberOfPassesPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.ADD_NUMBER_OF_PASSES,
    apply: (payload, ctx) => {
        const state = ctx.getState();
        return {
            ...state,
            customState: {
                ...state.customState,
                numberOfPasses: state.customState.numberOfPasses + payload.numberOfPasses,
            },
        };
    },
};

export const addFinishedPlayer: ActionTemplate<
    AddFinishedPlayerPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.ADD_FINISHED_PLAYER,
    apply: (payload, ctx) => {
        const state = ctx.getState();
        return {
            ...state,
            customState: {
                ...state.customState,
                finishedPlayers: [...state.customState.finishedPlayers, payload.playerId],
            },
        };
    },
};

export const clearFinishedPlayers: ActionTemplate<
    ClearFinishedPlayersPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.CLEAR_FINISHED_PLAYERS,
    apply: (_, ctx) => {
        const state = ctx.getState();
        return { ...state, customState: { ...state.customState, finishedPlayers: [] } };
    },
};

export const setScore: ActionTemplate<
    SetScorePayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.SET_SCORE,
    apply: (payload, ctx) => {
        const state = ctx.getState();
        return { ...state, customState: { ...state.customState, score: payload.score } };
    },
};

export const addScoreForTeam: ActionTemplate<
    AddScoreForTeamPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.ADD_SCORE_FOR_TEAM,
    apply: (payload, ctx) => {
        const state = ctx.getState();
        let teamNo: 'team1' | 'team2' = 'team1';
        for (const [teamN, { teamId }] of Object.entries(state.customState.score)) {
            if (teamId === payload.teamId) {
                teamNo = teamN as 'team1' | 'team2';
                break;
            }
        }
        return {
            ...state,
            customState: {
                ...state.customState,
                score: {
                    ...state.customState.score,
                    [teamNo]: {
                        ...state.customState.score[teamNo],
                        score: state.customState.score[teamNo]!.score + payload.score,
                    },
                },
            },
        };
    },
};

export const setPlayedCombination: ActionTemplate<
    SetPlayedCombinationPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.SET_PLAYED_COMBINATION,
    apply: (payload, ctx) => {
        const state = ctx.getState();
        return {
            ...state,
            customState: {
                ...state.customState,
                playedCombination: {
                    cards: payload.cards,
                    type: payload.type,
                    playedBy: payload.playedBy,
                },
            },
        };
    },
};

export const resetPlayedCombination: ActionTemplate<
    ResetPlayedCombinationPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.RESET_PLAYED_COMBINATION,
    apply: (_, ctx) => {
        const state = ctx.getState();
        return {
            ...state,
            customState: {
                ...state.customState,
                playedCombination: DEFAULT_PLAYED_COMBINATION,
            },
        };
    },
};

export const setSentCardsForPlayer: ActionTemplate<
    SetSentCardsForPlayerPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.SET_SENT_CARDS_FOR_PLAYER,
    apply: (payload, ctx) => {
        const state = ctx.getState();
        return {
            ...state,
            customState: {
                ...state.customState,
                sentCards: {
                    ...state.customState.sentCards,
                    [payload.playerId]: payload.cards,
                },
            },
        };
    },
};

export const resetAllSentCards: ActionTemplate<
    ResetAllSentCardsPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.RESET_ALL_SENT_CARDS,
    apply: (_, ctx) => {
        const state = ctx.getState();
        const resetSentCards = Object.keys(state.customState.sentCards).reduce((acc, playerId) => {
            acc[playerId] = [];
            return acc;
        }, {} as { [playerId: string]: Card<TichuCard>[] });
        return { ...state, customState: { ...state.customState, sentCards: resetSentCards } };
    },
};

export const setCalledTichuForPlayer: ActionTemplate<
    SetCalledTichuForPlayerPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.SET_CALLED_TICHU_FOR_PLAYER,
    apply: (payload, ctx) => {
        const state = ctx.getState();
        return {
            ...state,
            customState: {
                ...state.customState,
                calledTichu: {
                    ...state.customState.calledTichu,
                    [payload.playerId]: payload.calledTichu,
                },
            },
        };
    },
};

export const resetCalledTichus: ActionTemplate<
    ResetCalledTichusPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.RESET_CALLED_TICHUS,
    apply: (_, ctx) => {
        const state = ctx.getState();
        const resetCalledTichu = Object.keys(state.customState.calledTichu).reduce(
            (acc, playerId) => {
                acc[playerId] = false;
                return acc;
            },
            {} as { [playerId: string]: TypeOfTichu }
        );
        return { ...state, customState: { ...state.customState, calledTichu: resetCalledTichu } };
    },
};

export const addHasSentCards: ActionTemplate<
    AddHasSentCardsPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.ADD_HAS_SENT_CARDS,
    apply: (payload, ctx) => {
        const state = ctx.getState();
        return {
            ...state,
            customState: {
                ...state.customState,
                hasSentCards: [...state.customState.hasSentCards, payload.playerId],
            },
        };
    },
};

export const clearHasSentCards: ActionTemplate<
    ClearHasSentCardsPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.CLEAR_HAS_SENT_CARDS,
    apply: (_, ctx) => {
        const state = ctx.getState();
        return { ...state, customState: { ...state.customState, hasSentCards: [] } };
    },
};

export const addHasCalledTichu: ActionTemplate<
    AddHasCalledTichuPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.ADD_HAS_CALLED_TICHU,
    apply: (payload, ctx) => {
        const state = ctx.getState();
        return {
            ...state,
            customState: {
                ...state.customState,
                hasCalledTichu: [...state.customState.hasCalledTichu, payload.playerId],
            },
        };
    },
};

export const clearHasCalledTichu: ActionTemplate<
    ClearHasCalledTichuPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.CLEAR_HAS_CALLED_TICHU,
    apply: (_, ctx) => {
        const state = ctx.getState();
        return { ...state, customState: { ...state.customState, hasCalledTichu: [] } };
    },
};

export const prepareForNewRound: ActionTemplate<
    PrepareForNewRoundPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.PREPARE_FOR_NEW_ROUND,
    apply: (_, ctx) => {
        const state = ctx.getState();
        const playerIds = state.customState.originalPlayOrder;
        // New custom state
        const newCustomState: TichuState = {
            ...state.customState,
            numberOfPasses: 0,
            finishedPlayers: [],
            calledTichu: createObjectWithKeyPlayerIds<TypeOfTichu>(playerIds, false),
            hasCalledTichu: [],
            playedCombination: DEFAULT_PLAYED_COMBINATION,
            sentCards: createObjectWithKeyPlayerIds<Card<TichuCard>[]>(playerIds, []),
            hasSentCards: [],
        };
        // Move cards from all zones to the deck
        const allZonesIds = Object.keys(state.coreState.zones!);
        const allCards = ctx.randomize(
            allZonesIds.reduce((acc, zoneId) => {
                return [...acc, ...state.coreState.zones![zoneId]!.cards];
            }, [] as Card<TichuCard>[])
        );
        const allCardsWithResetPhowenixValue = allCards.map((card) => {
            if (card.templateId === SPECIAL_CARDS.PHOENIX) {
                return {
                    ...card,
                    templateFields: {
                        ...card.templateFields,
                        custom: { ...card.templateFields.custom, value: undefined },
                    },
                } as Card<TichuCard>;
            }
            return card;
        });
        const newZones = allZonesIds.reduce((acc, zoneId) => {
            acc[zoneId] = {
                ...state.coreState.zones![zoneId]!,
                cards: zoneId === ZONES.START_DECK ? allCardsWithResetPhowenixValue : [],
            };
            return acc;
        }, {} as { [zoneId: string]: Zone<any, TichuCard> });
        const originalPlayOrder = state.customState.originalPlayOrder;
        const newTurnOrder = {
            playOrder: originalPlayOrder,
            activePlayer: EVERYBODY,
            nextPlayer: originalPlayOrder[1],
            activePlayerIndex: 0,
        };
        return {
            ...state,
            customState: newCustomState,
            coreState: { ...state.coreState, zones: newZones, turnOrder: newTurnOrder },
        };
    },
};

export const resetNumberOfPasses: ActionTemplate<
    ResetNumberOfPassesPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: tichuActions.RESET_NUMBER_OF_PASSES,
    apply: (_, ctx) => {
        const state = ctx.getState();
        return { ...state, customState: { ...state.customState, numberOfPasses: 0 } };
    },
};

export const allTichuActions = [
    setDefaultCustomState,
    setOriginalPlayOrder,
    addNumberOfPasses,
    addFinishedPlayer,
    clearFinishedPlayers,
    addScoreForTeam,
    setScore,
    setPlayedCombination,
    resetPlayedCombination,
    setSentCardsForPlayer,
    resetAllSentCards,
    setCalledTichuForPlayer,
    resetCalledTichus,
    addHasSentCards,
    clearHasSentCards,
    addHasCalledTichu,
    clearHasCalledTichu,
    resetNumberOfPasses,
    prepareForNewRound,
] as ActionTemplate<any, TichuState, TichuGameSettings, any, TichuCard>[];
