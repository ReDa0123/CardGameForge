import { useSelector } from 'react-redux';
import { getRoomPlayersCount, getRoomId } from '../../selectors';
import { useSocket } from '../../context';
import React, { useCallback } from 'react';
import { events } from '../../../shared/constants/events';
import { Button, Grid2 as Grid, Stack, Typography } from '@mui/material';

type GameLobbyProps = {
    minNumberOfPlayers: number;
    maxNumberOfPlayers: number;
    GameOptionsFormComponent?: React.ComponentType<any>;
    gameOptions?: Record<string, any>;
};

export const GameLobby: React.FC<GameLobbyProps> = ({
    minNumberOfPlayers,
    maxNumberOfPlayers,
    GameOptionsFormComponent,
    gameOptions,
}) => {
    const numberOfPlayers = useSelector(getRoomPlayersCount);
    const roomId = useSelector(getRoomId)!;
    const socket = useSocket();
    const onGameStart = useCallback(() => {
        if (gameOptions) {
            socket?.emit(events.rooms.GAME_START, gameOptions as any);
        } else {
            socket?.emit(events.rooms.GAME_START);
        }
    }, [socket, gameOptions]);

    const onRoomLeave = useCallback(() => {
        socket?.emit(events.rooms.DISCONNECT_FROM_ROOM);
    }, [socket]);

    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Typography variant="h4">Game lobby - room: {roomId}</Typography>
            </Grid>
            <Grid size={6}>
                <Button onClick={onRoomLeave} color="error">
                    Leave room
                </Button>
                <Stack spacing={2}>
                    <Typography>Minimum number of players: {minNumberOfPlayers}</Typography>
                    <Typography>Maximum number of players: {maxNumberOfPlayers}</Typography>
                    <Typography>Current number of players: {numberOfPlayers}</Typography>
                </Stack>
            </Grid>

            <Grid size={6}>
                {GameOptionsFormComponent && <GameOptionsFormComponent />}
                <Button
                    onClick={onGameStart}
                    disabled={numberOfPlayers < minNumberOfPlayers}
                    color="success"
                >
                    Start game
                </Button>
            </Grid>
        </Grid>
    );
};
