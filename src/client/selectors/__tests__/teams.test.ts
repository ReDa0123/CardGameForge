import { getTeams, getTeamPlayersByTeamId, getTeamPlayersByPlayerId, areTeammates } from '../teams';
import { GameState, ReduxState } from '../../types';
import { Teams } from '../../../shared';

describe('teams selectors', () => {
    const mockTeams: Teams = {
        team1: ['player1', 'player2'],
        team2: ['player3', 'player4'],
    };

    const mockGameState: Partial<GameState<any, any, any, any>> = {
        coreState: {
            teams: mockTeams,
        } as GameState<any, any, any, any>['coreState'],
    };

    const mockState: ReduxState<any, any, any, any> = {
        game: {
            ...(mockGameState as GameState<any, any, any, any>),
        },
    };

    describe('getTeams', () => {
        it('should return all teams', () => {
            const result = getTeams(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual(mockTeams);
        });
    });

    describe('getTeamPlayersByTeamId', () => {
        it('should return players for a specific team', () => {
            const getTeam1Players = getTeamPlayersByTeamId('team1');
            const result = getTeam1Players(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual(['player1', 'player2']);
        });

        it('should return undefined for non-existent team', () => {
            const getNonExistentTeam = getTeamPlayersByTeamId('nonExistentTeam');
            const result = getNonExistentTeam(mockState as ReduxState<any, any, any, any>);
            expect(result).toBeUndefined();
        });

        it('should handle undefined teams state', () => {
            const stateWithoutTeams: Partial<ReduxState<any, any, any, any>> = {
                game: {
                    ...(mockGameState as GameState<any, any, any, any>),
                    coreState: {
                        teams: null,
                    } as GameState<any, any, any, any>['coreState'],
                },
            };
            const getTeam = getTeamPlayersByTeamId('team1');
            const result = getTeam(stateWithoutTeams as ReduxState<any, any, any, any>);
            expect(result).toBeUndefined();
        });
    });

    describe('getTeamPlayersByPlayerId', () => {
        it('should return teammates for a specific player', () => {
            const getPlayer1Teammates = getTeamPlayersByPlayerId('player1');
            const result = getPlayer1Teammates(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual(['player1', 'player2']);
        });

        it('should return empty array for non-existent player', () => {
            const getNonExistentPlayer = getTeamPlayersByPlayerId('nonExistentPlayer');
            const result = getNonExistentPlayer(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual([]);
        });

        it('should handle undefined teams state', () => {
            const stateWithoutTeams: Partial<ReduxState<any, any, any, any>> = {
                game: {
                    ...(mockGameState as GameState<any, any, any, any>),
                    coreState: {
                        teams: null,
                    } as GameState<any, any, any, any>['coreState'],
                },
            };
            const getPlayer = getTeamPlayersByPlayerId('player1');
            const result = getPlayer(stateWithoutTeams as ReduxState<any, any, any, any>);
            expect(result).toEqual([]);
        });
    });

    describe('areTeammates', () => {
        it('should return true for players in the same team', () => {
            const checkTeammates = areTeammates('player1', 'player2');
            const result = checkTeammates(mockState as ReduxState<any, any, any, any>);
            expect(result).toBe(true);
        });

        it('should return false for players in different teams', () => {
            const checkTeammates = areTeammates('player1', 'player3');
            const result = checkTeammates(mockState as ReduxState<any, any, any, any>);
            expect(result).toBe(false);
        });

        it('should return false when first player does not exist', () => {
            const checkTeammates = areTeammates('nonExistentPlayer', 'player1');
            const result = checkTeammates(mockState as ReduxState<any, any, any, any>);
            expect(result).toBe(false);
        });

        it('should return false when second player does not exist', () => {
            const checkTeammates = areTeammates('player1', 'nonExistentPlayer');
            const result = checkTeammates(mockState as ReduxState<any, any, any, any>);
            expect(result).toBe(false);
        });

        it('should handle undefined teams state', () => {
            const stateWithoutTeams: Partial<ReduxState<any, any, any, any>> = {
                game: {
                    ...(mockGameState as GameState<any, any, any, any>),
                    coreState: {
                        teams: null,
                    } as GameState<any, any, any, any>['coreState'],
                },
            };
            const checkTeammates = areTeammates('player1', 'player2');
            const result = checkTeammates(stateWithoutTeams as ReduxState<any, any, any, any>);
            expect(result).toBe(false);
        });
    });
});
