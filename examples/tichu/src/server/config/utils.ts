import { SPECIAL_CARDS, ZONES } from '../constants';
import { Card, GameState, Zone, Teams } from 'cardgameforge/server';
import { TichuCard, TichuGameSettings, TichuState } from '../types';

export const getTeammateIdFromTeam = (teams: Teams, teamId: string, playerId: string): string => {
    const players = teams[teamId];
    return players.filter((p) => p !== playerId)[0];
};

export const findPlayerNextTo = (playerIds: string[], playerId: string, plus: number = 1) => {
    const index = playerIds.indexOf(playerId);
    const indexOfNextPlayer = (index + plus) % playerIds.length;
    return playerIds[indexOfNextPlayer];
};

export const getNextPlayerNotFinished = (
    originalPlayOrder: string[],
    playerId: string,
    finished: string[]
) => {
    let nextPlayer = findPlayerNextTo(originalPlayOrder, playerId);
    while (finished.includes(nextPlayer)) {
        nextPlayer = findPlayerNextTo(originalPlayOrder, nextPlayer);
    }
    return nextPlayer;
};

export const findPlayersHandId = (zones: Zone<any, TichuCard>[], playerId: string) =>
    zones.find((zone: Zone<any, TichuCard>) => zone.type === ZONES.HAND && zone.owner === playerId)!
        .id;

export const findPlayersCollectedPileId = (zones: Zone<any, TichuCard>[], playerId: string) =>
    zones.find(
        (zone: Zone<any, TichuCard>) => zone.type === ZONES.COLLECTED && zone.owner === playerId
    )!.id;

export const findPlayersCollectedPileCards = (zones: Zone<any, TichuCard>[], playerId: string) =>
    zones.find(
        (zone: Zone<any, TichuCard>) => zone.type === ZONES.COLLECTED && zone.owner === playerId
    )!.cards;

export const getPlayerTeamMap = (teams: Teams) => {
    const playerTeamMap: Record<string, string> = {};
    for (const [teamId, players] of Object.entries(teams)) {
        for (const playerId of players) {
            playerTeamMap[playerId] = teamId;
        }
    }
    return playerTeamMap;
};

export const calculateScoreFromCollected = (collectedCards: Card<TichuCard>[]) =>
    collectedCards.reduce((acc, card) => acc + card.templateFields.custom!.scoreValue, 0);

export const isDragonInPlayedCards = (
    state: GameState<TichuState, TichuGameSettings, any, TichuCard>
) =>
    state.coreState.zones[ZONES.PLAYED_CARDS]!.cards.some(
        (card) => card.templateId === SPECIAL_CARDS.DRAGON
    );

export const isTurnEnd = (state: GameState<TichuState, TichuGameSettings, any, TichuCard>) => {
    const playerTeamMap = getPlayerTeamMap(state.coreState.teams!);
    const finishedPlayers = state.customState.finishedPlayers;
    const didBothTeammatesFinish =
        finishedPlayers.length === 2 &&
        finishedPlayers.every(
            (playerId) => playerTeamMap[playerId] === playerTeamMap[finishedPlayers[0]]
        );
    const didTurnEndNormally = finishedPlayers.length === 3;
    return didBothTeammatesFinish || didTurnEndNormally;
};
