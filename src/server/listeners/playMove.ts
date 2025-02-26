import { Server, Socket } from 'socket.io';
import { GameConfig, Metadata, MoveDefinition } from '../types';
import { getRoomGameData, getNetworkState, executeMove } from '../state';
import { events } from '../../shared/constants/events';

type PlayMoveArgs = {
    moveName: string;
    payload: unknown;
};

const playMove =
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
     * Play move listener.
     * @param moveName
     * @param payload
     */
    ({ moveName, payload }: PlayMoveArgs) => {
        const roomId = socket.roomId;
        const roomNetworkState = getNetworkState(io, roomId);
        if (!roomNetworkState || !roomId) {
            if (gameConfig.logErrors) {
                console.log(`${socket.id} is not in a room`);
            }
            return;
        }

        //Check if the game is in progress
        const gameData = getRoomGameData<CustomState, CustomGameOptions, CustomZone, CustomCard>(
            roomId
        );
        const gameState = gameData?.gameState;

        if (!gameData || !gameState) {
            if (gameConfig.logErrors) {
                console.log(`No game data found for room ${roomId}`);
            }
            return;
        }

        if (!gameState.coreState.gameInProgress) {
            if (gameConfig.logErrors) {
                console.log(`Game not in progress`);
            }
            return;
        }

        // Check if the player is the active player
        const activePlayer = gameState.coreState.turnOrder.activePlayer;
        const playerId = socket.id;

        if (activePlayer !== playerId) {
            if (gameConfig.logErrors) {
                console.log(`${playerId} is not the active player`);
            }
            return;
        }

        const move = gameData.movesRegistry.getMove(moveName);

        if (!move) {
            if (gameConfig.logErrors) {
                console.log(`Move ${moveName} not found`);
            }
            return;
        }

        const meta: Metadata = {
            roomId,
            playerId,
            playerNickname: socket.nickname,
            timestamp: new Date(),
            moveId: moveName,
        };

        // Execute the move
        const { didExecute, newState, reason } = executeMove<
            unknown,
            CustomState,
            CustomGameOptions,
            CustomZone,
            CustomCard
        >(
            move as MoveDefinition<unknown, CustomState, CustomGameOptions, CustomZone, CustomCard>,
            payload,
            meta
        );

        if (!didExecute) {
            if (gameConfig.logErrors) {
                console.log(`Move ${moveName} did not execute. ${reason}`);
            }
            socket.emit(events.MOVE_FAILED, reason);
            return;
        }
        io.to(roomId).emit(events.GAME_STATE_CHANGED, newState);
    };

export default playMove;
