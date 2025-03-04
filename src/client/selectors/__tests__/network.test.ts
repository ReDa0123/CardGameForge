import { getNetworkInfo, getRoomPlayersCount, getRoomId, isInLobby } from '../network';
import { ReduxState, GameState } from '../../types';

describe('network selectors', () => {
    const mockGameState: Partial<GameState<any, any, any, any>> = {
        networkState: {
            playerId: 'player-123',
            playerNickname: 'Player 1',
            roomId: 'room-123',
            players: [
                { playerId: 'player-123', playerNickname: 'Player 1' },
                { playerId: 'player-456', playerNickname: 'Player 2' },
                { playerId: 'player-789', playerNickname: 'Player 3' },
            ],
        } as GameState<any, any, any, any>['networkState'],
    };

    const mockState: ReduxState<any, any, any, any> = {
        game: {
            ...(mockGameState as GameState<any, any, any, any>),
        },
    };

    describe('getNetworkInfo', () => {
        it('should return the complete network state', () => {
            const result = getNetworkInfo(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual(mockGameState.networkState);
        });

        it('should return empty object when network state is undefined', () => {
            const emptyState: ReduxState<any, any, any, any> = {
                game: {
                    ...(mockGameState as GameState<any, any, any, any>),
                    networkState: null,
                },
            };
            const result = getNetworkInfo(emptyState as ReduxState<any, any, any, any>);
            expect(result).toEqual({});
        });
    });

    describe('getRoomPlayersCount', () => {
        it('should return the number of players in the room', () => {
            const result = getRoomPlayersCount(mockState as ReduxState<any, any, any, any>);
            expect(result).toBe(3);
        });

        it('should return 0 when players array is undefined', () => {
            const stateWithoutPlayers: Partial<ReduxState<any, any, any, any>> = {
                game: {
                    ...(mockGameState as GameState<any, any, any, any>),
                    networkState: {
                        roomId: 'room-123',
                    },
                },
            };
            const result = getRoomPlayersCount(
                stateWithoutPlayers as ReduxState<any, any, any, any>
            );
            expect(result).toBe(0);
        });

        it('should return 0 when network state is undefined', () => {
            const emptyState: Partial<ReduxState<any, any, any, any>> = {
                game: {
                    ...(mockGameState as GameState<any, any, any, any>),
                    networkState: null,
                },
            };
            const result = getRoomPlayersCount(emptyState as ReduxState<any, any, any, any>);
            expect(result).toBe(0);
        });
    });

    describe('getRoomId', () => {
        it('should return the room ID', () => {
            const result = getRoomId(mockState as ReduxState<any, any, any, any>);
            expect(result).toBe('room-123');
        });

        it('should return undefined when network state is undefined', () => {
            const emptyState: Partial<ReduxState<any, any, any, any>> = {
                game: {
                    ...(mockGameState as GameState<any, any, any, any>),
                    networkState: null,
                },
            };
            const result = getRoomId(emptyState as ReduxState<any, any, any, any>);
            expect(result).toBeUndefined();
        });
    });

    describe('isInLobby', () => {
        it('should return true when room ID exists', () => {
            const result = isInLobby(mockState as ReduxState<any, any, any, any>);
            expect(result).toBe(true);
        });

        it('should return false when room ID is undefined', () => {
            const stateWithoutRoomId: Partial<ReduxState<any, any, any, any>> = {
                game: {
                    ...(mockGameState as GameState<any, any, any, any>),
                    networkState: {
                        players: [],
                    },
                },
            };
            const result = isInLobby(stateWithoutRoomId as ReduxState<any, any, any, any>);
            expect(result).toBe(false);
        });

        it('should return false when network state is undefined', () => {
            const emptyState: Partial<ReduxState<any, any, any, any>> = {
                game: {
                    ...(mockGameState as GameState<any, any, any, any>),
                    networkState: null,
                },
            };
            const result = isInLobby(emptyState as ReduxState<any, any, any, any>);
            expect(result).toBe(false);
        });
    });
});
