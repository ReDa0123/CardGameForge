import { NetworkState } from '../../types';
import { Server, Socket } from 'socket.io';

export const getNetworkState = (io: Server, roomId: string | undefined): NetworkState | null => {
    if (!roomId) {
        return null;
    }

    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) {
        return null;
    }

    const players = Array.from(room).map((clientId) => {
        const client = io.sockets.sockets.get(clientId) as Socket;
        return {
            playerId: clientId,
            playerNickname: client.nickname!,
        };
    });

    return {
        roomId,
        players,
    };
};
