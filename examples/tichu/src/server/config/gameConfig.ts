import { TichuCard, TichuGameSettings, TichuState } from '../types';
import { phases } from './phases';
import { cardCollection } from './cardCollection';
import { zones } from './zones';
import {
    actionTypes,
    AddToZonePayload,
    ChangePhasePayload,
    SetTeamsPayload,
    GameConfig,
    Card,
    ChangeZonePayload,
    MoveCardsFromZonePayload,
    SetActivePlayerPayload,
    SetTurnOrderPayload,
    ShuffleZonePayload,
    Teams,
    TurnOrder,
    EVERYBODY,
} from 'cardgameforge/server';
import {
    DEFAULT_PLAYED_COMBINATION,
    GAME_PHASES,
    SPECIAL_CARDS,
    TYPES_OF_TICHU,
    ZONES,
} from '../constants';
import {
    allTichuActions,
    SetDefaultCustomStatePayload,
    SetOriginalPlayOrderPayload,
    tichuActions,
    AddScoreForTeamPayload,
    PrepareForNewRoundPayload,
    ClearHasCalledTichuPayload,
    AddHasCalledTichuPayload,
    AddHasSentCardsPayload,
    AddFinishedPlayerPayload,
    AddNumberOfPassesPayload,
    ResetPlayedCombinationPayload,
    SetPlayedCombinationPayload,
} from './actions';
import {
    findPlayersHandId,
    findPlayersCollectedPileId,
    getPlayerTeamMap,
    findPlayersCollectedPileCards,
    calculateScoreFromCollected,
    findPlayerNextTo,
    isDragonInPlayedCards,
    isTurnEnd,
    getNextPlayerNotFinished,
} from './utils';
import { getCardCombination } from '../combinationResolver/getCardCombination';
import { moves } from './moves';
const tichuInitialCustomState: TichuState = {
    numberOfPasses: 0,
    finishedPlayers: [],
    calledTichu: {},
    score: {},
    playedCombination: DEFAULT_PLAYED_COMBINATION,
    sentCards: {},
    hasSentCards: [],
    hasCalledTichu: [],
    originalPlayOrder: [],
};

export const tichuGameConfig: GameConfig<TichuState, TichuGameSettings, any, TichuCard> = {
    name: 'Tichu',
    minPlayers: 4,
    maxPlayers: 4,
    customState: tichuInitialCustomState,
    moves,
    actions: allTichuActions,
    //randomSeed: 42,
    phases,
    endGameCondition: (ctx) => {
        const state = ctx.getState();
        const team1Score = state.customState.score.team1!;
        const team2Score = state.customState.score.team2!;
        const scoreToWin = state.gameOptions.scoreToWin;
        let wonId: string | undefined = undefined;
        if (team1Score.score >= scoreToWin && team1Score.score > team2Score.score) {
            wonId = team1Score.teamId;
        }

        if (team2Score.score >= scoreToWin && team2Score.score > team1Score.score) {
            wonId = team2Score.teamId;
        }

        if (wonId) {
            return {
                isTie: false,
                winner: wonId,
                reason: `${wonId} has more than ${scoreToWin} points and won teh game.`,
            };
        }

        if (team1Score.score >= scoreToWin && team1Score.score === team2Score.score) {
            return {
                isTie: true,
                reason: `Both teams have more than ${scoreToWin} and have the same points - the game is a tie.`,
            };
        }
        return null;
    },
    afterGameEnd: (ctx) => {
        ctx.exportHistory('/', 'TichuTest');
        return ctx.getState();
    },
    defaultCustomGameOptions: {
        scoreToWin: 500,
    },
    zones,
    cardCollection,
    gameSetup: (ctx, meta) => {
        let state = ctx.getState();
        // Create teams
        const playerIds = state.networkState!.players.map((p) => p.playerId);
        const team1Name = playerIds[0] + playerIds[2];
        const team2Name = playerIds[1] + playerIds[3];
        const teams: Teams = playerIds.reduce(
            (acc, playerId, index) => {
                const teamId = index % 2 === 0 ? team1Name : team2Name;
                acc[teamId].push(playerId);
                return acc;
            },
            { [team1Name]: [] as string[], [team2Name]: [] as string[] }
        );
        ctx.dispatchAction<SetTeamsPayload>(actionTypes.SET_TEAMS, teams, meta);
        state = ctx.getState();

        // Put all cards in the deck, shuffle and deal 8 cards to each player
        const allCards: Card<TichuCard>[] = [];

        for (const cardTemplate of state.coreState.cardCollection) {
            const card = ctx.createCardFromTemplate(cardTemplate);
            allCards.push(card);
        }

        const shuffledCards = ctx.randomize(allCards);
        const initialCardsPerPlayer = 8;
        const remainingCardsPerPlayer = 6;

        const zones = Object.values(state.coreState.zones);

        for (const playerId of playerIds) {
            const cardsToDeal = [];
            for (let i = 0; i < initialCardsPerPlayer; i++) {
                cardsToDeal.push(shuffledCards.pop()!);
            }
            const handId = findPlayersHandId(zones, playerId);
            ctx.dispatchAction<AddToZonePayload>(
                actionTypes.ADD_TO_ZONE,
                {
                    cards: cardsToDeal,
                    toZoneId: handId,
                },
                meta
            );
        }

        state = ctx.getState();
        // Add the remaining cards to the start deck
        ctx.dispatchAction<AddToZonePayload>(
            actionTypes.ADD_TO_ZONE,
            {
                cards: shuffledCards,
                toZoneId: ZONES.START_DECK,
            },
            meta
        );
        // Set custom state defualts
        ctx.dispatchAction<SetDefaultCustomStatePayload>(
            tichuActions.SET_DEFAULT_CUSTOM_STATE,
            {},
            meta
        );
        ctx.dispatchAction<SetOriginalPlayOrderPayload>(
            tichuActions.SET_ORIGINAL_PLAY_ORDER,
            {
                playOrder: state.coreState.turnOrder.playOrder,
            },
            meta
        );

        ctx.dispatchAction<SetActivePlayerPayload>(
            actionTypes.SET_ACTIVE_PLAYER,
            { playerId: EVERYBODY },
            meta
        );

        // BIG_TICHU - Hook for dealing 8 cards to each player
        ctx.addAfterHook<ChangePhasePayload>(
            actionTypes.CHANGE_PHASE,
            'dealCards',
            (payload, ctx, meta) => {
                if (payload.phase !== GAME_PHASES.BIG_TICHU) {
                    return payload;
                }
                ctx.dispatchAction<ShuffleZonePayload>(
                    actionTypes.SHUFFLE_ZONE,
                    { zoneId: ZONES.START_DECK },
                    meta
                );
                const state = ctx.getState();
                // Deal 8 cards to each player by moving them from the deck to players hands
                const zones = state.coreState.zones;
                const deckZone = zones[ZONES.START_DECK];
                const handZones = Object.values(zones).filter((zone) => zone.type === ZONES.HAND);
                for (const handZone of handZones) {
                    ctx.dispatchAction<MoveCardsFromZonePayload>(
                        actionTypes.MOVE_CARDS_FROM_ZONE,
                        { fromZoneId: deckZone.id, toZoneId: handZone.id, numberOfCards: 8 },
                        meta
                    );
                }
                return payload;
            }
        );

        // SMALL_TICHU - Hook for dealing the remaining cards to players hands and resetting called tichus
        ctx.addAfterHook<ChangePhasePayload>(
            actionTypes.CHANGE_PHASE,
            'dealCards',
            (payload, ctx, meta) => {
                if (payload.phase !== GAME_PHASES.SMALL_TICHU) {
                    return payload;
                }
                let state = ctx.getState();
                // Deal the remaining cards to players hands
                const zones = state.coreState.zones;
                const deckZone = zones[ZONES.START_DECK];
                const handZones = Object.values(zones).filter((zone) => zone.type === ZONES.HAND);
                for (const handZone of handZones) {
                    ctx.dispatchAction<MoveCardsFromZonePayload>(
                        actionTypes.MOVE_CARDS_FROM_ZONE,
                        {
                            fromZoneId: deckZone.id,
                            toZoneId: handZone.id,
                            numberOfCards: remainingCardsPerPlayer,
                        },
                        meta
                    );
                }
                // Reset called tichus
                ctx.dispatchAction<ClearHasCalledTichuPayload>(
                    tichuActions.CLEAR_HAS_CALLED_TICHU,
                    {},
                    meta
                );
                state = ctx.getState();
                // Set hasCalledTichu who called big tichu
                const playerIds = state.coreState.turnOrder.playOrder;
                const bigTichuPlayersId = playerIds.filter(
                    (id) => !state.customState.calledTichu[id]
                );
                for (const playerId of bigTichuPlayersId) {
                    ctx.dispatchAction<AddHasCalledTichuPayload>(
                        tichuActions.ADD_HAS_CALLED_TICHU,
                        { playerId },
                        meta
                    );
                }
                return payload;
            }
        );

        // PLAY_CARDS - Hook for sending cards after send cards phase and setting first player
        ctx.addBeforeHook<ChangePhasePayload>(
            actionTypes.CHANGE_PHASE,
            'sendCards',
            (payload, ctx, meta) => {
                let state = ctx.getState();
                if (
                    payload.phase !== GAME_PHASES.PLAY_CARDS ||
                    state.coreState.phase !== GAME_PHASES.SEND_CARDS
                ) {
                    return payload;
                }
                // Sending cards
                const playerIds = state.coreState.turnOrder.playOrder;
                const sentCards = state.customState.sentCards;
                const zones = Object.values(state.coreState.zones);
                for (const playerId of playerIds) {
                    const [cardToBeSentLeft, cardToTeammate, cardToBeSentRight] =
                        sentCards[playerId]!;
                    const leftPlayerId = findPlayerNextTo(playerIds, playerId);
                    const teammateId = findPlayerNextTo(playerIds, playerId, 2);
                    const rightPlayerId = findPlayerNextTo(playerIds, playerId, 3);
                    const playerHandId = findPlayersHandId(zones, playerId);
                    const leftPlayerHandId = findPlayersHandId(zones, leftPlayerId);
                    const teammateHandId = findPlayersHandId(zones, teammateId);
                    const rightPlayerHandId = findPlayersHandId(zones, rightPlayerId);
                    ctx.dispatchAction<ChangeZonePayload>(
                        actionTypes.CHANGE_ZONE,
                        {
                            fromZoneId: playerHandId,
                            toZoneId: leftPlayerHandId,
                            cardIds: cardToBeSentLeft.id,
                        },
                        meta
                    );
                    ctx.dispatchAction<ChangeZonePayload>(
                        actionTypes.CHANGE_ZONE,
                        {
                            fromZoneId: playerHandId,
                            toZoneId: teammateHandId,
                            cardIds: cardToTeammate.id,
                        },
                        meta
                    );
                    ctx.dispatchAction<ChangeZonePayload>(
                        actionTypes.CHANGE_ZONE,
                        {
                            fromZoneId: playerHandId,
                            toZoneId: rightPlayerHandId,
                            cardIds: cardToBeSentRight.id,
                        },
                        meta
                    );
                }
                state = ctx.getState();

                // Setting first player
                const hands = Object.values(state.coreState.zones).filter(
                    (zone) => zone.type === ZONES.HAND
                );
                const playerIdWithMahjongInHand = hands.find(({ cards }) =>
                    cards.map((card) => card.templateId).includes(SPECIAL_CARDS.MAHJONG)
                )!.owner!;

                ctx.dispatchAction<SetActivePlayerPayload>(
                    actionTypes.SET_ACTIVE_PLAYER,
                    { playerId: playerIdWithMahjongInHand },
                    meta
                );

                return payload;
            }
        );

        // SEND_DECK - Hook for setting active player to the player who won the collected deck
        ctx.addAfterHook<ChangePhasePayload>(
            actionTypes.CHANGE_PHASE,
            'resolveDeckWin',
            (payload, ctx, meta) => {
                if (payload.phase !== GAME_PHASES.SEND_DECK) {
                    return payload;
                }
                const state = ctx.getState();
                const playerIdWhoWonCollected = state.customState.playedCombination.playedBy!;
                ctx.dispatchAction<SetActivePlayerPayload>(
                    actionTypes.SET_ACTIVE_PLAYER,
                    { playerId: playerIdWhoWonCollected },
                    meta
                );
                return payload;
            }
        );

        // SEND_DECK to PLAY_CARDS - Hook for resetting played combination
        ctx.addBeforeHook<ChangePhasePayload>(
            actionTypes.CHANGE_PHASE,
            'resetPlayedCombination',
            (payload, ctx, meta) => {
                if (
                    payload.phase !== GAME_PHASES.PLAY_CARDS ||
                    ctx.getState().coreState.phase !== GAME_PHASES.SEND_DECK
                ) {
                    return payload;
                }
                if (isTurnEnd(state)) {
                    return { phase: GAME_PHASES.TURN_END };
                }
                ctx.dispatchAction<ResetPlayedCombinationPayload>(
                    tichuActions.RESET_PLAYED_COMBINATION,
                    {},
                    meta
                );
                const activePlayer = state.coreState.turnOrder.activePlayer;
                const finishedPlayers = state.customState.finishedPlayers;
                if (finishedPlayers.includes(activePlayer)) {
                    const originalPlayOrder = state.customState.originalPlayOrder;
                    ctx.dispatchAction<SetActivePlayerPayload>(
                        actionTypes.SET_ACTIVE_PLAYER,
                        {
                            playerId: getNextPlayerNotFinished(
                                originalPlayOrder,
                                activePlayer,
                                finishedPlayers
                            ),
                        },
                        meta
                    );
                }
                return payload;
            }
        );

        // TURN_END - Hook for resolving called tichus, adding scores and reseting state after turn ends
        ctx.addAfterHook<ChangePhasePayload>(
            actionTypes.CHANGE_PHASE,
            'setScoreAndResetState',
            (payload, ctx, meta) => {
                if (payload.phase !== GAME_PHASES.TURN_END) {
                    return payload;
                }
                let state = ctx.getState();
                // Resolve called tichus
                const calledTichusArr = Object.entries(state.customState.calledTichu);
                const teams = state.coreState.teams!;
                const playerTeamMap = getPlayerTeamMap(teams);
                for (const [playerId, calledTichu] of calledTichusArr) {
                    if (calledTichu) {
                        const points = calledTichu === TYPES_OF_TICHU.BIG ? 200 : 100;
                        const didPlayerFinishFirst =
                            state.customState.finishedPlayers[0] === playerId;
                        const playersTeamId = playerTeamMap[playerId];
                        ctx.dispatchAction<AddScoreForTeamPayload>(
                            tichuActions.ADD_SCORE_FOR_TEAM,
                            {
                                teamId: playersTeamId,
                                score: didPlayerFinishFirst ? points : -points,
                            },
                            meta
                        );
                        // TODO: Add message to history so that it will be displayed in the UI
                    }
                }

                state = ctx.getState();
                // If both teammates ended first and second, add 200 to their team score
                const [team1Id, team1Players] = Object.entries(state.coreState.teams!)[0];
                const [team2Id, team2Players] = Object.entries(state.coreState.teams!)[1];
                const finishedPlayers = state.customState.finishedPlayers;
                const sortedFinishedPlayers = [...finishedPlayers].sort();
                if (sortedFinishedPlayers === [...team1Players].sort()) {
                    ctx.dispatchAction<AddScoreForTeamPayload>(
                        tichuActions.ADD_SCORE_FOR_TEAM,
                        {
                            teamId: team1Id,
                            score: 200,
                        },
                        meta
                    );
                } else if (sortedFinishedPlayers === [...team2Players].sort()) {
                    ctx.dispatchAction<AddScoreForTeamPayload>(
                        tichuActions.ADD_SCORE_FOR_TEAM,
                        {
                            teamId: team2Id,
                            score: 200,
                        },
                        meta
                    );
                } else {
                    // Move cards from the last players hand and collected pile to the player who finished first
                    const playerIds = state.coreState.turnOrder.playOrder;
                    const zones = Object.values(state.coreState.zones);
                    const lastPlayerId = playerIds.filter((id) => !finishedPlayers.includes(id))[0];
                    const lastPlayerHandId = findPlayersHandId(zones, lastPlayerId);
                    const lastPlayerCollectedPileId = findPlayersCollectedPileId(
                        zones,
                        lastPlayerId
                    );
                    const firstPlayerId = finishedPlayers[0];
                    const firstPlayerHandId = findPlayersHandId(zones, firstPlayerId);
                    const firstPlayerCollectedPileId = findPlayersCollectedPileId(
                        zones,
                        firstPlayerId
                    );

                    ctx.dispatchAction<MoveCardsFromZonePayload>(
                        actionTypes.MOVE_CARDS_FROM_ZONE,
                        {
                            fromZoneId: lastPlayerHandId,
                            toZoneId: firstPlayerHandId,
                        },
                        meta
                    );
                    ctx.dispatchAction<MoveCardsFromZonePayload>(
                        actionTypes.MOVE_CARDS_FROM_ZONE,
                        {
                            fromZoneId: lastPlayerCollectedPileId,
                            toZoneId: firstPlayerCollectedPileId,
                        },
                        meta
                    );
                    // Add the played cards to the player who finished first
                    ctx.dispatchAction<MoveCardsFromZonePayload>(
                        actionTypes.MOVE_CARDS_FROM_ZONE,
                        {
                            fromZoneId: ZONES.PLAYED_CARDS,
                            toZoneId: firstPlayerHandId,
                        },
                        meta
                    );

                    state = ctx.getState();
                    const playerTeamMap = getPlayerTeamMap(state.coreState.teams!);
                    // Add score to finished players teams
                    for (const playerId of finishedPlayers) {
                        const teamId = playerTeamMap[playerId];
                        const collectedPileOfPlayer = findPlayersCollectedPileCards(
                            zones,
                            playerId
                        );
                        const score = calculateScoreFromCollected(collectedPileOfPlayer);
                        ctx.dispatchAction<AddScoreForTeamPayload>(
                            tichuActions.ADD_SCORE_FOR_TEAM,
                            { teamId, score },
                            meta
                        );
                    }
                }
                state = ctx.getState();
                const didGameEnd = !state.coreState.gameInProgress;
                if (didGameEnd) {
                    return payload;
                }
                // Reset state for new round
                ctx.dispatchAction<PrepareForNewRoundPayload>(
                    tichuActions.PREPARE_FOR_NEW_ROUND,
                    {},
                    meta
                );
                // Change phase to BIG_TICHU
                ctx.dispatchAction<ChangePhasePayload>(
                    actionTypes.CHANGE_PHASE,
                    { phase: GAME_PHASES.BIG_TICHU },
                    meta
                );
                return payload;
            }
        );

        // Hook for sending cards
        ctx.addAfterHook<AddHasSentCardsPayload>(
            tichuActions.ADD_HAS_SENT_CARDS,
            'allCardsSent',
            (payload, ctx, meta) => {
                const state = ctx.getState();
                if (state.customState.hasSentCards.length >= 4) {
                    ctx.dispatchAction<ChangePhasePayload>(
                        actionTypes.CHANGE_PHASE,
                        { phase: GAME_PHASES.PLAY_CARDS },
                        meta
                    );
                }
                return payload;
            }
        );

        // Hook for calling tichus
        ctx.addAfterHook<AddHasCalledTichuPayload>(
            tichuActions.ADD_HAS_CALLED_TICHU,
            'allTichusCalled',
            (payload, ctx, meta) => {
                const state = ctx.getState();
                if (state.customState.hasCalledTichu.length >= 4) {
                    const newPhase =
                        state.coreState.phase === GAME_PHASES.BIG_TICHU
                            ? GAME_PHASES.SMALL_TICHU
                            : GAME_PHASES.SEND_CARDS;
                    ctx.dispatchAction<ChangePhasePayload>(
                        actionTypes.CHANGE_PHASE,
                        { phase: newPhase },
                        meta
                    );
                }
                return payload;
            }
        );

        // Hook for playing cards - resolving new combination and finished player
        ctx.addAfterHook<ChangeZonePayload>(
            actionTypes.CHANGE_ZONE,
            'playCardsResolveFinishedPlayer',
            (payload, ctx, meta) => {
                const state = ctx.getState();
                const fromZone = state.coreState.zones[payload.fromZoneId]!;
                const toZone = state.coreState.zones[payload.toZoneId]!;
                if (fromZone.type !== ZONES.HAND || toZone.type !== ZONES.PLAYED_CARDS) {
                    return payload;
                }
                // Resolve new combination
                const playedCardIds = Array.isArray(payload.cardIds)
                    ? payload.cardIds
                    : [payload.cardIds];
                const isPlayedCardDog = playedCardIds[0].includes(SPECIAL_CARDS.DOG);
                if (!isPlayedCardDog) {
                    const playedCards = state.coreState.zones[ZONES.PLAYED_CARDS].cards;
                    const playerId = state.coreState.turnOrder.activePlayer;
                    const currentCombination = state.customState.playedCombination;
                    const combinationType =
                        currentCombination.type ?? getCardCombination(fromZone.cards)!;
                    ctx.dispatchAction<SetPlayedCombinationPayload>(
                        tichuActions.SET_PLAYED_COMBINATION,
                        {
                            cards: playedCards,
                            playedBy: playerId,
                            type: combinationType,
                        },
                        meta
                    );
                }
                // Resolve if player has finished
                const playerHandCards = fromZone.cards;
                if (playerHandCards.length === 0) {
                    // Player has finished
                    ctx.dispatchAction<AddFinishedPlayerPayload>(
                        tichuActions.ADD_FINISHED_PLAYER,
                        { playerId: fromZone.owner! },
                        meta
                    );
                }
                return payload;
            }
        );

        // Hook for finished players and changing turn order
        ctx.addAfterHook<AddFinishedPlayerPayload>(
            tichuActions.ADD_FINISHED_PLAYER,
            'resolvingFinishedPlayers',
            (payload, ctx, meta) => {
                let state = ctx.getState();
                // Resolve if turn has ended
                if (isTurnEnd(state)) {
                    // Resolve phase to continue game
                    const playedCardsContainDragon = isDragonInPlayedCards(state);
                    ctx.dispatchAction<ChangePhasePayload>(
                        actionTypes.CHANGE_PHASE,
                        {
                            phase: playedCardsContainDragon
                                ? GAME_PHASES.SEND_DECK
                                : GAME_PHASES.TURN_END,
                        },
                        meta
                    );
                } else {
                    // Update turn order
                    const currentTurnOrder = state.coreState.turnOrder;
                    const finishedPlayers = state.customState.finishedPlayers;
                    const currentPlayOrder = currentTurnOrder.playOrder;
                    const newPlayOrder = currentPlayOrder.filter(
                        (id) => !finishedPlayers.includes(id)
                    );
                    const nextPlayer = currentTurnOrder.activePlayer;
                    const newActivePlayerIndex = newPlayOrder.indexOf(nextPlayer);
                    const newTurnOrder: TurnOrder = {
                        playOrder: newPlayOrder,
                        activePlayer: nextPlayer,
                        activePlayerIndex: newActivePlayerIndex,
                        nextPlayer: newPlayOrder[(newActivePlayerIndex + 1) % newPlayOrder.length],
                    };
                    ctx.dispatchAction<SetTurnOrderPayload>(
                        actionTypes.SET_TURN_ORDER,
                        newTurnOrder,
                        meta
                    );
                }

                return payload;
            }
        );

        // Hook for passing
        ctx.addAfterHook<AddNumberOfPassesPayload>(
            tichuActions.ADD_NUMBER_OF_PASSES,
            'resolveDeckWin',
            (payload, ctx, meta) => {
                const state = ctx.getState();
                const numberOfPasses = state.customState.numberOfPasses;
                const playOrderCount = state.coreState.turnOrder.playOrder.length;
                if (numberOfPasses >= playOrderCount - 1) {
                    const playedCardsContainDragon = isDragonInPlayedCards(state);
                    if (playedCardsContainDragon) {
                        ctx.dispatchAction<ChangePhasePayload>(
                            actionTypes.CHANGE_PHASE,
                            { phase: GAME_PHASES.SEND_DECK },
                            meta
                        );
                    } else {
                        const playerIdWhoWonDeck = state.customState.playedCombination.playedBy!;
                        const zones = Object.values(state.coreState.zones);
                        const playerHandId = findPlayersHandId(zones, playerIdWhoWonDeck);
                        ctx.dispatchAction<MoveCardsFromZonePayload>(
                            actionTypes.MOVE_CARDS_FROM_ZONE,
                            {
                                fromZoneId: ZONES.PLAYED_CARDS,
                                toZoneId: playerHandId,
                            },
                            meta
                        );
                        ctx.dispatchAction<ResetPlayedCombinationPayload>(
                            tichuActions.RESET_PLAYED_COMBINATION,
                            {},
                            meta
                        );
                    }
                }
                return payload;
            }
        );

        return ctx.getState();
    },
    logErrors: true,
};
