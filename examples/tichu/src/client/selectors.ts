import {
    createSelector,
    getNetworkInfo,
    getPhase,
    getYourPlayerId,
    NetworkState,
    ReduxState,
} from 'cardgameforge/client';
import { TichuState } from 'src/server/types';

export const getOriginalPlayOrder = (state: ReduxState<TichuState, any, any, any>) =>
    state.game.customState.originalPlayOrder;

export const getHasSentCards = (state: ReduxState<TichuState, any, any, any>) =>
    state.game.customState.hasSentCards;

export const getHasCalledTichu = (state: ReduxState<TichuState, any, any, any>) =>
    state.game.customState.hasCalledTichu;

export const getPlayedCombination = (state: ReduxState<TichuState, any, any, any>) =>
    state.game.customState.playedCombination;

export const getCalledTichus = (state: ReduxState<TichuState, any, any, any>) =>
    state.game.customState.calledTichu;

export const getNumberOfPasses = (state: ReduxState<TichuState, any, any, any>) =>
    state.game.customState.numberOfPasses;

export const getTeamScores = (state: ReduxState<TichuState, any, any, any>) =>
    state.game.customState.score;

export const getNicknamesForTeamPlayers = (
    teamId: string,
    state: ReduxState<TichuState, any, any, any>
) => {
    const players = state.game.coreState.teams![teamId];
    const playersOfTheTeam = state.game.networkState!.players!.filter((player) =>
        players.includes(player.playerId)
    );
    return playersOfTheTeam.map((player) => player.playerNickname).join(', ');
};

export const getTeamScoresWithTeamNames = (state: ReduxState<TichuState, any, any, any>) =>
    Object.values(state.game.customState.score).map((score) => ({
        ...score,
        teamName: getNicknamesForTeamPlayers(score.teamId, state),
    }));

export const getHandIds = createSelector(
    [getYourPlayerId, getOriginalPlayOrder],
    (yourPlayerId, originalPlayOrder) => {
        const yourIndex = originalPlayOrder.indexOf(yourPlayerId!);
        const leftPlayerId = originalPlayOrder[(yourIndex + 1) % originalPlayOrder.length];
        const teammateId = originalPlayOrder[(yourIndex + 2) % originalPlayOrder.length];
        const rightPlayerId = originalPlayOrder[(yourIndex + 3) % originalPlayOrder.length];
        return {
            yourHandId: `HAND_${yourPlayerId}`,
            leftPlayerHandId: `HAND_${leftPlayerId}`,
            teammateHandId: `HAND_${teammateId}`,
            rightPlayerHandId: `HAND_${rightPlayerId}`,
        };
    }
);

export const getCollectedPileIds = createSelector(
    [getYourPlayerId, getOriginalPlayOrder],
    (yourPlayerId, originalPlayOrder) => {
        const yourIndex = originalPlayOrder.indexOf(yourPlayerId!);
        const leftPlayerId = originalPlayOrder[(yourIndex + 1) % originalPlayOrder.length];
        const teammateId = originalPlayOrder[(yourIndex + 2) % originalPlayOrder.length];
        const rightPlayerId = originalPlayOrder[(yourIndex + 3) % originalPlayOrder.length];
        return {
            yourCollectedPileId: `COLLECTED_${yourPlayerId}`,
            leftPlayerCollectedPileId: `COLLECTED_${leftPlayerId}`,
            teammateCollectedPileId: `COLLECTED_${teammateId}`,
            rightPlayerCollectedPileId: `COLLECTED_${rightPlayerId}`,
        };
    }
);

export const hasSentCards = createSelector(
    [getYourPlayerId, getHasSentCards],
    (yourPlayerId, sentCardsIds) => {
        return sentCardsIds.includes(yourPlayerId!);
    }
);

export const hasCalledTichu = createSelector(
    [getYourPlayerId, getHasCalledTichu],
    (yourPlayerId, calledTichuIds) => {
        return calledTichuIds.includes(yourPlayerId!);
    }
);

export const getTichuType = createSelector(getPhase, (phase) => {
    if (phase === 'BIG_TICHU') {
        return 'Grand Tichu';
    }
    if (phase === 'SMALL_TICHU') {
        return 'Tichu';
    }
    return '';
});

export const getPlayedCombinationInfo = createSelector(
    [getPlayedCombination, getNetworkInfo],
    (playedCombination, networkInfo: NetworkState) => {
        return {
            currentCombination: playedCombination.type,
            cardsInCombination: playedCombination.cards.map((card) => card.templateFields.name),
            playedBy: networkInfo.players?.find(
                ({ playerId }) => playedCombination.playedBy === playerId
            )?.playerNickname,
        };
    }
);

export const getOtherPlayersInfo = createSelector(
    [getYourPlayerId, getOriginalPlayOrder, getNetworkInfo],
    (yourPlayerId, originalPlayOrder, networkInfo) => {
        const yourIndex = originalPlayOrder.indexOf(yourPlayerId!);
        const leftPlayerId = originalPlayOrder[(yourIndex + 1) % originalPlayOrder.length];
        const teammateId = originalPlayOrder[(yourIndex + 2) % originalPlayOrder.length];
        const rightPlayerId = originalPlayOrder[(yourIndex + 3) % originalPlayOrder.length];
        const leftPlayerNickname = networkInfo!.players!.find(
            (player) => player.playerId === leftPlayerId
        )!.playerNickname;
        const rightPlayerNickname = networkInfo!.players!.find(
            (player) => player.playerId === rightPlayerId
        )!.playerNickname;
        const teammateNickname = networkInfo!.players!.find(
            (player) => player.playerId === teammateId
        )!.playerNickname;
        return {
            leftPlayerId,
            rightPlayerId,
            teammateId,
            leftPlayerNickname,
            rightPlayerNickname,
            teammateNickname,
        };
    }
);
