import { Server, Socket } from 'socket.io';
import { GameConfig } from '../types';
import { getNetworkState } from '../state';
import { events } from '../../shared/constants/events';
import { prepareGameState } from '../state';

type GameStartArgs<CustomGameOptions> = {
    roomId: string;
    gameOptions?: CustomGameOptions;
};

const gameStart =
    <
        CustomState,
        CustomGameOptions,
        CustomZone extends Record<string, any>,
        CustomCard extends Record<string, any>
    >(
        io: Server,
        socket: Socket,
        gameConfig: GameConfig<CustomState, CustomGameOptions, CustomZone, CustomCard>
    ) =>
    /**
     * Game start listener.
     * @param roomId The room id
     * @param gameOptions Game options sent from the game lobby
     */
    ({ roomId, gameOptions }: GameStartArgs<CustomGameOptions>) => {
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

        io.to(roomId).emit(events.rooms.GAME_STARTED, gameState);
    };

export default gameStart;
