import { GAME_PHASES, MOVES, SPECIAL_CARDS, ZONES } from '../constants';
import { TichuCard, TichuGameSettings, TichuState, TypeOfTichu } from '../types';
import { findPlayersCollectedPileId, findPlayersHandId, isTurnEnd } from './utils';
import {
    actionTypes,
    Card,
    ChangeCardPayload,
    ChangePhasePayload,
    ChangeZonePayload,
    EndTurnPayload,
    MoveCardsFromZonePayload,
    MoveDefinition,
} from 'cardgameforge/server';
import { isCombinationHigher } from '../combinationResolver/isCombinationHigher';
import { isPlayedCombinationSameOrBombed } from '../combinationResolver/isPlayedCombinationSameOrBombed';
import { getCardCombination } from '../combinationResolver/getCardCombination';
import {
    AddNumberOfPassesPayload,
    tichuActions,
    SetCalledTichuForPlayerPayload,
    AddHasCalledTichuPayload,
    AddHasSentCardsPayload,
    SetSentCardsForPlayerPayload,
    ResetNumberOfPassesPayload,
} from './actions';

export type PlayCardsPayload = {
    cardIds: string[];
    phoenixValue?: number;
};

export type SendDeckPayload = {
    playerId: string;
};

export type CallTichuPayload = {
    calledTichu: boolean;
};

export type SendCardsPayload = {
    sentCardIds: string[];
};

const playCardMove: MoveDefinition<
    PlayCardsPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: MOVES.PLAY_CARDS,
    allowedPhases: [GAME_PHASES.PLAY_CARDS],
    canExecute: ({ cardIds, phoenixValue }, ctx, meta) => {
        const playerId = meta.playerId!;
        const state = ctx.getState();
        const zones = state.coreState.zones;
        const zonesArr = Object.values(zones);
        const playersHandId = findPlayersHandId(zonesArr, playerId);
        const playersHandCards = zones[playersHandId]!.cards;

        const areCardsInPlayersHand = cardIds.every((id) =>
            playersHandCards.some((card) => card.id === id)
        );
        if (!areCardsInPlayersHand) {
            return { canExecute: false, reason: 'Cards not in players hand' };
        }

        let playedCards = playersHandCards.filter((card) => cardIds.includes(card.id));
        const dogCard = playedCards.find((card) => card.templateId === SPECIAL_CARDS.DOG);
        const dragonCard = playedCards.find((card) => card.templateId === SPECIAL_CARDS.DRAGON);
        const phoenixCard = playedCards.find((card) => card.templateId === SPECIAL_CARDS.PHOENIX);
        if (phoenixCard && !phoenixValue) {
            return { canExecute: false, reason: 'Phoenix card value not set' };
        }
        if (dogCard) {
            return dogCard.templateFields.moves![MOVES.PLAY_CARDS]!.canExecute!(
                { cardIds },
                ctx,
                dogCard.id,
                meta
            );
        }
        if (dragonCard) {
            return dragonCard.templateFields.moves![MOVES.PLAY_CARDS]!.canExecute!(
                { cardIds },
                ctx,
                dragonCard.id,
                meta
            );
        }
        if (phoenixCard) {
            ctx.dispatchAction<ChangeCardPayload>(
                actionTypes.CHANGE_CARD,
                {
                    cardId: phoenixCard.id,
                    zoneId: playersHandId,
                    cardChanges: {
                        templateFields: {
                            ...phoenixCard.templateFields,
                            custom: {
                                ...phoenixCard.templateFields.custom,
                                value: phoenixValue,
                            },
                        },
                    },
                },
                meta
            );
            playedCards = playedCards.map((card) =>
                card.id === phoenixCard.id
                    ? ({
                          ...phoenixCard,
                          templateFields: {
                              ...phoenixCard.templateFields,
                              custom: { ...phoenixCard.templateFields.custom, value: phoenixValue },
                          },
                      } as Card<TichuCard>)
                    : card
            );
        }
        const currentCombination = state.customState.playedCombination;
        const currentCombinationType = currentCombination.type;
        const playedCombination = getCardCombination(playedCards);
        const isValidCombination = !!playedCombination;
        if (!isValidCombination) {
            if (phoenixCard) {
                ctx.dispatchAction<ChangeCardPayload>(
                    actionTypes.CHANGE_CARD,
                    {
                        cardId: phoenixCard.id,
                        zoneId: playersHandId,
                        cardChanges: {
                            templateFields: {
                                ...phoenixCard.templateFields,
                                custom: {
                                    ...phoenixCard.templateFields.custom,
                                    value: undefined,
                                },
                            },
                        },
                    },
                    meta
                );
            }
            return { canExecute: false, reason: 'Invalid combination played' };
        }
        if (!currentCombinationType) {
            return { canExecute: true };
        }

        const { canBePlayed, isBombedOver } = isPlayedCombinationSameOrBombed(
            playedCombination,
            currentCombinationType
        );
        if (!canBePlayed) {
            if (phoenixCard) {
                ctx.dispatchAction<ChangeCardPayload>(
                    actionTypes.CHANGE_CARD,
                    {
                        cardId: phoenixCard.id,
                        zoneId: playersHandId,
                        cardChanges: {
                            templateFields: {
                                ...phoenixCard.templateFields,
                                custom: {
                                    ...phoenixCard.templateFields.custom,
                                    value: undefined,
                                },
                            },
                        },
                    },
                    meta
                );
            }
            return {
                canExecute: false,
                reason: `You must play ${currentCombinationType} as the combination`,
            };
        }

        const isPlayedCombinationHigher = isCombinationHigher(
            playedCombination,
            playedCards,
            currentCombination.cards
        );
        if (!isPlayedCombinationHigher && !isBombedOver) {
            if (phoenixCard) {
                ctx.dispatchAction<ChangeCardPayload>(
                    actionTypes.CHANGE_CARD,
                    {
                        cardId: phoenixCard.id,
                        zoneId: playersHandId,
                        cardChanges: {
                            templateFields: {
                                ...phoenixCard.templateFields,
                                custom: {
                                    ...phoenixCard.templateFields.custom,
                                    value: undefined,
                                },
                            },
                        },
                    },
                    meta
                );
            }
            return {
                canExecute: false,
                reason: `You must play a higher valued ${currentCombinationType}.`,
            };
        }

        return { canExecute: true };
    },
    execute: ({ cardIds }, ctx, meta) => {
        const playerId = meta.playerId!;
        const state = ctx.getState();
        const zones = state.coreState.zones;
        const zonesArr = Object.values(zones);
        const playersHandId = findPlayersHandId(zonesArr, playerId);
        const playersHandCards = zones[playersHandId]!.cards;
        const playedCards = playersHandCards.filter((card) => cardIds.includes(card.id));
        const dogCard = playedCards.find((card) => card.templateId === SPECIAL_CARDS.DOG);
        if (dogCard) {
            dogCard.templateFields.moves![MOVES.PLAY_CARDS]!.execute!(
                { cardIds: [dogCard.id] },
                ctx,
                dogCard.id,
                meta
            );
        } else {
            ctx.dispatchAction<ChangeZonePayload>(
                actionTypes.CHANGE_ZONE,
                {
                    cardIds,
                    fromZoneId: playersHandId,
                    toZoneId: ZONES.PLAYED_CARDS,
                },
                meta
            );
            ctx.dispatchAction<ResetNumberOfPassesPayload>(
                tichuActions.RESET_NUMBER_OF_PASSES,
                {},
                meta
            );

            if (
                !ctx.getState().customState.finishedPlayers.includes(playerId) &&
                !isTurnEnd(state) &&
                ctx.getState().coreState.phase === GAME_PHASES.PLAY_CARDS
            ) {
                ctx.dispatchAction<EndTurnPayload>(actionTypes.END_TURN, {}, meta);
            }
        }
    },
    message: ({ cardIds }, ctx, meta) => {
        const playerNickname = meta.playerNickname!;
        if (cardIds.some((id) => id.includes(SPECIAL_CARDS.DOG))) {
            return `${playerNickname} played the dog.`;
        }
        const playerId = meta.playerId!;
        const state = ctx.getState();
        const zones = state.coreState.zones;
        const zonesArr = Object.values(zones);
        const playersHandId = findPlayersHandId(zonesArr, playerId);
        const playersHandCards = zones[playersHandId]!.cards;
        const playedCards = playersHandCards.filter((card) => cardIds.includes(card.id));
        const playedCombination =
            state.customState.playedCombination.type ?? getCardCombination(playedCards);
        const playedCardsNamesSeparatedByComma = cardIds
            .map(
                (id) =>
                    state.coreState.zones[playersHandId]!.cards.find((card) => card.id === id)!
                        .templateFields.name
            )
            .join(', ');
        return `${playerNickname} played ${playedCombination} with cards: ${playedCardsNamesSeparatedByComma}.`;
    },
};

const passMove: MoveDefinition<any, TichuState, TichuGameSettings, any, TichuCard> = {
    name: MOVES.PASS,
    allowedPhases: [GAME_PHASES.PLAY_CARDS],
    canExecute: (_, ctx) => {
        const playedCards = ctx.getState().customState.playedCombination.cards;
        if (playedCards.length === 0) {
            return {
                canExecute: false,
                reason: "You can't pass if a card hasn't been played",
            };
        }
        return { canExecute: true };
    },
    execute: (_, ctx, meta) => {
        ctx.dispatchAction<AddNumberOfPassesPayload>(
            tichuActions.ADD_NUMBER_OF_PASSES,
            {
                numberOfPasses: 1,
            },
            meta
        );
        if (ctx.getState().coreState.phase !== GAME_PHASES.SEND_DECK) {
            ctx.dispatchAction<EndTurnPayload>(actionTypes.END_TURN, {}, meta);
        }
    },
    message: (_, __, meta) => {
        const playerNickname = meta.playerNickname!;
        return `${playerNickname} passed`;
    },
};

const sendDeckMove: MoveDefinition<SendDeckPayload, TichuState, TichuGameSettings, any, TichuCard> =
    {
        name: MOVES.SEND_DECK,
        allowedPhases: [GAME_PHASES.SEND_DECK],
        execute: ({ playerId }, ctx, meta) => {
            const state = ctx.getState();
            const zones = state.coreState.zones;
            const zonesArr = Object.values(zones);
            const receiverCollectedPileId = findPlayersCollectedPileId(zonesArr, playerId);
            ctx.dispatchAction<MoveCardsFromZonePayload>(
                actionTypes.MOVE_CARDS_FROM_ZONE,
                {
                    fromZoneId: ZONES.PLAYED_CARDS,
                    toZoneId: receiverCollectedPileId,
                },
                meta
            );
            ctx.dispatchAction<ChangePhasePayload>(
                actionTypes.CHANGE_PHASE,
                { phase: GAME_PHASES.PLAY_CARDS },
                meta
            );
        },
        message: ({ playerId }, ctx, meta) => {
            const playerNickname = meta.playerNickname!;
            const receiverNickname = ctx
                .getState()
                .networkState!.players.find(
                    (player) => player.playerId === playerId
                )!.playerNickname;
            return `${playerNickname} sent the deck with dragon to ${receiverNickname}.`;
        },
    };

const callTichuMove: MoveDefinition<
    CallTichuPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: MOVES.CALL_TICHU,
    allowedPhases: [GAME_PHASES.BIG_TICHU, GAME_PHASES.SMALL_TICHU],
    execute: ({ calledTichu }, ctx, meta) => {
        const playerId = meta.playerId!;
        if (calledTichu) {
            const phase = ctx.getState().coreState.phase;
            const calledTichu: TypeOfTichu = phase === GAME_PHASES.BIG_TICHU ? 'BIG' : 'SMALL';
            ctx.dispatchAction<SetCalledTichuForPlayerPayload>(
                tichuActions.SET_CALLED_TICHU_FOR_PLAYER,
                {
                    playerId,
                    calledTichu,
                },
                meta
            );
        }
        ctx.dispatchAction<AddHasCalledTichuPayload>(
            tichuActions.ADD_HAS_CALLED_TICHU,
            {
                playerId,
            },
            meta
        );
    },
    message: ({ calledTichu }, { getState }, meta) => {
        const playerNickname = meta.playerNickname!;
        const currentPhase = getState().coreState.phase;
        const tichuName = currentPhase === GAME_PHASES.BIG_TICHU ? 'Grand Tichu' : 'Tichu';
        if (calledTichu) {
            return `${playerNickname} called ${tichuName}.`;
        }
        return `${playerNickname} did not call ${tichuName}.`;
    },
};

const sendCardsMove: MoveDefinition<
    SendCardsPayload,
    TichuState,
    TichuGameSettings,
    any,
    TichuCard
> = {
    name: MOVES.SEND_CARDS,
    allowedPhases: [GAME_PHASES.SEND_CARDS],
    canExecute: ({ sentCardIds }, ctx, meta) => {
        const zones = ctx.getState().coreState.zones;
        const zonesArr = Object.values(zones);
        const playersHandId = findPlayersHandId(zonesArr, meta.playerId!);
        const cardsToSend = zones[playersHandId]!.cards.filter((card) =>
            sentCardIds.includes(card.id)
        );
        if (cardsToSend.length !== 3) {
            return { canExecute: false, reason: 'You must send 3 cards' };
        }
        return { canExecute: true };
    },
    execute: ({ sentCardIds }, ctx, meta) => {
        const playerId = meta.playerId!;
        const zones = ctx.getState().coreState.zones;
        const zonesArr = Object.values(zones);
        const playersHandId = findPlayersHandId(zonesArr, playerId);
        const cardsToSend = zones[playersHandId]!.cards.filter((card) =>
            sentCardIds.includes(card.id)
        );
        const sortedCardsToSend = cardsToSend.sort(
            (a, b) => sentCardIds.indexOf(a.id) - sentCardIds.indexOf(b.id)
        );
        ctx.dispatchAction<SetSentCardsForPlayerPayload>(
            tichuActions.SET_SENT_CARDS_FOR_PLAYER,
            {
                playerId,
                cards: sortedCardsToSend,
            },
            meta
        );
        ctx.dispatchAction<AddHasSentCardsPayload>(
            tichuActions.ADD_HAS_SENT_CARDS,
            {
                playerId,
            },
            meta
        );
    },
    message: (_, __, meta) => {
        const playerNickname = meta.playerNickname!;
        return `${playerNickname} sent cards.`;
    },
};

export const moves: MoveDefinition<any, TichuState, TichuGameSettings, any, TichuCard>[] = [
    playCardMove,
    passMove,
    sendDeckMove,
    callTichuMove,
    sendCardsMove,
];
