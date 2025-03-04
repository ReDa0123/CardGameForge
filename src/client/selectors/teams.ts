import { ReduxState } from '../types';

export const getTeams = (state: ReduxState<any, any, any, any>) => state.game.coreState.teams;

export const getTeamPlayersByTeamId = (teamId: string) => (state: ReduxState<any, any, any, any>) =>
    state.game.coreState.teams?.[teamId];

export const getTeamPlayersByPlayerId =
    (playerId: string) => (state: ReduxState<any, any, any, any>) => {
        const teams = state.game.coreState.teams;
        if (!teams) {
            return [];
        }
        return Object.values(teams).find((players) => players.includes(playerId)) || [];
    };

export const areTeammates =
    (playerId1: string, playerId2: string) => (state: ReduxState<any, any, any, any>) => {
        const teams = state.game.coreState.teams;
        if (!teams) {
            return false;
        }
        const teamOfFirstPlayer = Object.values(teams).find((players) =>
            players.includes(playerId1)
        );
        if (!teamOfFirstPlayer) {
            return false;
        }
        return teamOfFirstPlayer.includes(playerId2);
    };
