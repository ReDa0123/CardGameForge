import 'socket.io';
import { Server, Socket } from 'socket.io';
import { GameConfig } from './gameConfig';

declare module 'socket.io' {
    interface Socket {
        roomId?: string;
        nickname?: string;
    }
}

export type SocketListener<
    CustomState,
    CustomGameOptions,
    CustomZone extends Record<string, any>,
    CustomCard extends Record<string, any>
> = (
    io: Server,
    sock: Socket,
    config: GameConfig<CustomState, CustomGameOptions, CustomZone, CustomCard>
) => (...args: any[]) => void;
