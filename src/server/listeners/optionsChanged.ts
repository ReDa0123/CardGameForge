import { Server, Socket } from 'socket.io';
import { GameConfig } from '../types';
import { events } from '../../shared';

const optionsChanged =
    <
        CustomState extends Record<string, any>,
        CustomGameOptions extends Record<string, any>,
        CustomZone extends Record<string, any>,
        CustomCard extends Record<string, any>
    >(
        io: Server,
        socket: Socket,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _: GameConfig<CustomState, CustomGameOptions, CustomZone, CustomCard>
    ) =>
    /**
     * Disconnect listener.
     */
    ({ gameOptions }: { gameOptions: CustomGameOptions }) => {
        io.to(socket.roomId!).emit(events.rooms.OPTIONS_CHANGED, gameOptions);
    };

export default optionsChanged;
