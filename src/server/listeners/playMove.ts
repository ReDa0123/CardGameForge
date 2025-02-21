import { Server, Socket } from 'socket.io';
import { GameConfig } from '../types/gameConfig';
import { getRoomGameData, getNetworkState, executeMove } from '../state';
import { Metadata } from '../types/gameState';
import { events } from '../../shared/constants/events';

type PlayMoveArgs = {
    moveName: string;
    payload: unknown;
};

const playMove =
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
    ({ moveName, payload }: PlayMoveArgs) => {
        const roomId = socket.roomId;
        const roomNetworkState = getNetworkState(io, roomId);
        if (!roomNetworkState || !roomId) {
            if (gameConfig.logConnections) {
                console.log(`${socket.id} is not in a room`);
            }
            return;
        }

        //Check if the game is in progress
        const gameData = getRoomGameData(roomId);
        const gameState = gameData?.gameState;

        if (!gameData || !gameState) {
            if (gameConfig.logConnections) {
                console.log(`No game data found for room ${roomId}`);
            }
            return;
        }

        if (!gameState.coreState.gameInProgress) {
            if (gameConfig.logConnections) {
                console.log(`Game not in progress`);
            }
            return;
        }

        // Check if the player is the active player
        const activePlayer = gameState.coreState.turnOrder.activePlayer;
        const playerId = socket.id;

        if (activePlayer !== playerId) {
            if (gameConfig.logConnections) {
                console.log(`${playerId} is not the active player`);
            }
            return;
        }

        const move = gameData.movesRegistry.getMove(moveName);

        if (!move) {
            if (gameConfig.logConnections) {
                console.log(`Move ${moveName} not found`);
            }
            return;
        }

        const meta: Metadata = {
            roomId,
            playerId,
            playerNickname: socket.nickname,
            timestamp: Date.now(),
            moveId: moveName,
        };

        // Execute the move
        const { didExecute, newState, reason } = executeMove<
            unknown,
            CustomState,
            CustomGameOptions,
            CustomZone,
            CustomCard
        >(move, payload, meta);

        if (!didExecute) {
            if (gameConfig.logConnections) {
                console.log(`Move ${moveName} did not execute. ${reason}`);
            }
            socket.emit(events.MOVE_FAILED, reason);
            return;
        }
        io.to(roomId).emit(events.GAME_STATE_CHANGED, newState);
    };

export default playMove;
