import { useCallback } from 'react';
import { useSocket } from '../context';
import { events } from '../../shared/constants/events';
import { PlayMoveArgs } from '../../shared/types/events';

/**
 * React hook that returns a function to send a move to the server.
 * @param moveId - The id of the move
 */
export const useSendMove = <Payload = unknown>(moveId: string) => {
    const socket = useSocket();
    return useCallback(
        (payload: Payload) => {
            const playMoveArgs: PlayMoveArgs = { moveName: moveId, payload };
            socket?.emit(events.PLAY_MOVE, playMoveArgs as any);
        },
        [moveId, socket]
    );
};
