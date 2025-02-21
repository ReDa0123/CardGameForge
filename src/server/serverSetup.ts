import { createServer } from 'http';
import { Server, ServerOptions } from 'socket.io';
import { GameConfig } from './types/gameConfig';
import { SocketListener } from './types/socket';
import { joinRoom, disconnectFromRoom, disconnect, gameStart, playMove } from './listeners';
import { events } from '../shared/constants/events';
import { setLoadedConfig } from './state';

const setupAndRunServer = <
    CustomState,
    CustomGameOptions,
    CustomZone extends Record<string, any>,
    CustomCard extends Record<string, any>
>(
    port: number = 3000,
    opts: ServerOptions,
    gameConfig: GameConfig<CustomState, CustomGameOptions, CustomZone, CustomCard>
) => {
    const httpServer = createServer();
    const io = new Server(httpServer, opts);
    setLoadedConfig<CustomState, CustomGameOptions, CustomZone, CustomCard>(gameConfig);

    io.on('connection', (socket) => {
        console.log(`${socket.id} connected`);

        const withSocketGameContext = (
            listener: SocketListener<CustomState, CustomGameOptions, CustomZone, CustomCard>
        ) => listener(io, socket, gameConfig);

        socket.on(events.rooms.JOIN_ROOM, withSocketGameContext(joinRoom));

        socket.on(events.rooms.DISCONNECT_FROM_ROOM, withSocketGameContext(disconnectFromRoom));

        socket.on(events.rooms.GAME_START, withSocketGameContext(gameStart));

        socket.on(events.PLAY_TURN, withSocketGameContext(playMove));

        socket.on(events.DISCONNECT, withSocketGameContext(disconnect));
    });

    httpServer.listen(port, () => {
        console.log(`Game server is running on port ${port}`);
    });
};

export default setupAndRunServer;
