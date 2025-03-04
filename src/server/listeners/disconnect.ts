import { Server, Socket } from 'socket.io';
import { events } from '../../shared/constants/events';
import { getNetworkState } from '../state';
import { getRoomGameData, removeRoomGameData } from '../state';
import { GameConfig } from '../types';

const disconnect =
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
     * Disconnect listener.
     */
    () => {
        const networkState = getNetworkState(io, socket.roomId);
        if (networkState) {
            const roomId = socket.roomId!;
            if (gameConfig.logErrors) {
                console.log(`${socket.id} disconnected from room ${roomId}`);
            }

            // Remove the game data if it exists
            const roomData = getRoomGameData<
                CustomState,
                CustomGameOptions,
                CustomZone,
                CustomCard
            >(roomId);
            if (roomData) {
                const otherPlayersInRoom = io.sockets.adapter.rooms.get(roomId);
                if (otherPlayersInRoom) {
                    for (const otherPlayerId of otherPlayersInRoom) {
                        const otherPlayer = io.sockets.sockets.get(otherPlayerId) as Socket;
                        otherPlayer.roomId = undefined;
                        otherPlayer.nickname = undefined;
                    }
                }
                removeRoomGameData(roomId);
                io.to(roomId).emit(events.rooms.RESET_NETWORK_STATE);
            } else {
                io.to(roomId).emit(events.rooms.ROOM_STATE_CHANGED, networkState);
            }
        }
    };

export default disconnect;
