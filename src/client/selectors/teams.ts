import { ReduxState } from '../types';

/**
 * Selector to get the teams from the redux state.
 * @param state - The redux state
 * @returns The teams
 */
export const getTeams = (state: ReduxState<any, any, any, any>) => state.game.coreState.teams;

/**
 * Selector to get the team players by team id from the redux state.
 * @param teamId - The id of the team
 * @param state - The redux state
 * @returns The team players
 */
export const getTeamPlayersByTeamId = (teamId: string) => (state: ReduxState<any, any, any, any>) =>
    state.game.coreState.teams?.[teamId];

/**
 * Selector to get the team players by player id from the redux state.
 * @param playerId - The id of the player
 * @param state - The redux state
 * @returns The team players
 */
export const getTeamPlayersByPlayerId =
    (playerId: string) => (state: ReduxState<any, any, any, any>) => {
        const teams = state.game.coreState.teams;
        if (!teams) {
            return [];
        }
        return Object.values(teams).find((players) => players.includes(playerId)) || [];
    };

/**
 * Selector to check if two players are teammates.
 * @param playerId1 - The id of the first player
 * @param playerId2 - The id of the second player
 * @param state - The redux state
 * @returns True if the players are teammates, false otherwise
 */
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
