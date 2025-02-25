import { Server, Socket } from 'socket.io';
import { GameConfig } from '../types';
import { events } from '../../shared/constants/events';
import { getNetworkState } from '../state';

type JoinRoomArgs = {
    roomId: string;
    nickname: string;
};

const joinRoom =
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
     * Join room listener.
     * @param roomId The room id
     * @param nickname The joining player's nickname
     */
    ({ roomId, nickname }: JoinRoomArgs) => {
        // Check if the network id and nickname are valid
        if (!roomId || !nickname) {
            socket.emit(events.rooms.INVALID_ROOM_INPUT);
            return;
        }

        // Log the connection
        if (gameConfig.logErrors) {
            console.log(
                `${socket.id} is trying to join room ${roomId} with the nickname ${nickname}`
            );
        }

        const roomNetworkState = getNetworkState(io, roomId);
        const numPlayers = roomNetworkState ? roomNetworkState.players.length : 0;

        // Check if the room is full
        if (numPlayers >= gameConfig.maxPlayers) {
            socket.emit(events.rooms.ROOM_FULL);
            return;
        }

        // Check if the nickname is already taken
        if (roomNetworkState) {
            for (const playerNickname of roomNetworkState.players.map(
                (player) => player.playerNickname!
            )) {
                if (playerNickname === nickname) {
                    return socket.emit(events.rooms.NICKNAME_TAKEN);
                }
            }
        }

        socket.roomId = roomId;
        socket.nickname = nickname;
        socket.join(roomId);

        const newNetworkState = getNetworkState(io, roomId);
        io.to(roomId).emit(events.rooms.ROOM_STATE_CHANGED, newNetworkState);
    };

export default joinRoom;
