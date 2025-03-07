import { Server, Socket } from 'socket.io';
import { GameConfig } from '../types';
import { getNetworkState } from '../state';
import { events, GameStartArgs } from '../../shared';
import { prepareGameState } from '../state';

const gameStart =
    <
        CustomState extends Record<string, any>,
        CustomGameOptions extends Record<string, any>,
        CustomZone extends Record<string, any>,
        CustomCard extends Record<string, any>
    >(
        io: Server,
        socket: Socket,
        gameConfig: GameConfig<CustomState, CustomGameOptions, CustomZone, CustomCard>
    ) =>
    /**
     * Game start listener.
     * @param gameOptions Game options sent from the game lobby
     */
    ({ gameOptions }: GameStartArgs<CustomGameOptions>) => {
        const roomId = socket.roomId!;
        const roomNetworkState = getNetworkState(io, roomId);

        if (!roomNetworkState) {
            return;
        }

        // Check if there are enough players to start the game
        if (
            roomNetworkState.players.length < gameConfig.minPlayers ||
            roomNetworkState.players.length > gameConfig.maxPlayers
        ) {
            socket.emit(
                events.rooms.INVALID_NUMBER_OF_PLAYERS,
                `Invalid number of players: ${roomNetworkState.players.length}. 
                Should be between ${gameConfig.minPlayers} and ${gameConfig.maxPlayers}`
            );
            return;
        }

        const gameState = prepareGameState<CustomState, CustomGameOptions, CustomZone, CustomCard>(
            roomId,
            gameConfig,
            roomNetworkState,
            gameOptions
        );

        io.to(roomId).emit(events.GAME_STATE_CHANGED, gameState);
    };

export default gameStart;
