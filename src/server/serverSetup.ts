import { createServer } from 'http';
import { Server, ServerOptions } from 'socket.io';
import { GameConfig, SocketListener } from './types';
import {
    joinRoom,
    disconnectFromRoom,
    disconnect,
    gameStart,
    playMove,
    optionsChanged,
} from './listeners';
import { events } from '../shared';
import { setLoadedConfig } from './state';

/**
 * The main function to set up and run the game server.
 * Configures vite proxy to allow cross-origin requests from the client by default.
 * @param port The port to run the server on
 * @param opts Options for the socket.io server
 * @param gameConfig The game configuration
 */
const setupAndRunServer = <
    CustomState extends Record<string, any>,
    CustomGameOptions extends Record<string, any>,
    CustomZone extends Record<string, any>,
    CustomCard extends Record<string, any>
>(
    port: number = 3000,
    opts: Partial<ServerOptions> = {},
    gameConfig: GameConfig<CustomState, CustomGameOptions, CustomZone, CustomCard>
) => {
    const httpServer = createServer();
    const io = new Server(httpServer, {
        ...opts,
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
            ...(opts.cors || {}),
        },
    });
    setLoadedConfig<CustomState, CustomGameOptions, CustomZone, CustomCard>(gameConfig);

    io.on('connection', (socket) => {
        console.log(`${socket.id} connected`);

        const withSocketGameContext = (
            listener: SocketListener<CustomState, CustomGameOptions, CustomZone, CustomCard>
        ) => listener(io, socket, gameConfig);

        socket.on(events.rooms.JOIN_ROOM, withSocketGameContext(joinRoom));

        socket.on(events.rooms.DISCONNECT_FROM_ROOM, withSocketGameContext(disconnectFromRoom));

        socket.on(events.rooms.OPTIONS_CHANGED, withSocketGameContext(optionsChanged));

        socket.on(events.rooms.GAME_START, withSocketGameContext(gameStart));

        socket.on(events.PLAY_MOVE, withSocketGameContext(playMove));

        socket.on(events.DISCONNECT, withSocketGameContext(disconnect));
    });

    httpServer.listen(port, () => {
        console.log(`Game server is running on port ${port}`);
    });
};

export default setupAndRunServer;
