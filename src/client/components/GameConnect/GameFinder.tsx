import React, { ChangeEvent, useCallback, useState } from 'react';
import { useSocket } from '../../context';
import { events, JoinRoomArgs } from '../../../shared';
import { Button, Stack, TextField } from '@mui/material';

/**
 * GameFinder component that allows a player to join a room.
 */
export const GameFinder: React.FC = () => {
    const socket = useSocket();
    const [roomId, setRoomId] = useState('');
    const [nickname, setNickname] = useState('');

    const handleJoinRoom = useCallback(() => {
        const joinRoomArgs: JoinRoomArgs = { roomId, nickname };
        socket?.emit(events.rooms.JOIN_ROOM, joinRoomArgs as any);
    }, [roomId, nickname, socket]);

    return (
        <Stack spacing={2} padding={2}>
            <TextField
                label="Room ID to join"
                value={roomId}
                onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                    setRoomId(e.target.value)
                }
            />
            <TextField
                label="Your nickname"
                value={nickname}
                onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                    setNickname(e.target.value)
                }
            />
            <Button onClick={handleJoinRoom}>Join room</Button>
        </Stack>
    );
};
