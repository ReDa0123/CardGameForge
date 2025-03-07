import { createServer } from 'http';
import { Server, ServerOptions } from 'socket.io';
import { GameConfig, SocketListener } from './types';
import { joinRoom, disconnectFromRoom, disconnect, gameStart, playMove } from './listeners';
import { events } from '../shared';
import { setLoadedConfig } from './state';

/**
 * The main function to setup and run the game server.
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

        socket.on(events.PLAY_MOVE, withSocketGameContext(playMove));

        socket.on(events.DISCONNECT, withSocketGameContext(disconnect));
    });

    httpServer.listen(port, () => {
        console.log(`Game server is running on port ${port}`);
    });
};

export default setupAndRunServer;
