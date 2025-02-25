import { Server, Socket } from 'socket.io';
import { events } from '../../shared/constants/events';
import { getNetworkState } from '../state';
import { getRoomGameData, removeRoomGameData } from '../state';
import { GameConfig } from '../types';

const disconnectFromRoom =
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
     * Disconnect from room listener.
     */
    () => {
        const roomId = socket.roomId;
        socket.roomId = undefined;
        socket.nickname = undefined;

        if (!roomId) {
            return;
        }

        if (gameConfig.logErrors) {
            console.log(`${socket.id} disconnected from room ${roomId}`);
        }

        socket.leave(roomId);
        const networkState = getNetworkState(io, roomId);
        // Send an empty network state to the client
        socket.emit(events.rooms.ROOM_STATE_CHANGED, {
            roomId: null,
            players: [],
            playerNickname: null,
        });

        // Send the updated network state to all clients in the room
        if (networkState) {
            io.to(roomId).emit(events.rooms.ROOM_STATE_CHANGED, networkState);
        }

        // Remove the game data if it exists
        const roomData = getRoomGameData<CustomState, CustomGameOptions, CustomZone, CustomCard>(
            roomId
        );
        if (roomData) {
            const otherPlayersInRoom = io.sockets.adapter.rooms.get(roomId);
            if (otherPlayersInRoom) {
                for (const otherPlayerId of otherPlayersInRoom) {
                    const otherPlayer = io.sockets.sockets.get(otherPlayerId) as Socket;
                    otherPlayer.roomId = undefined;
                    otherPlayer.nickname = undefined;
                }
            }
            //TODO: on client remember to set network state to default after receiving this event
            removeRoomGameData(roomId);
        }
    };

export default disconnectFromRoom;
