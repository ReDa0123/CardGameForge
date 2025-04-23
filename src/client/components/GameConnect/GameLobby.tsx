import { useSelector } from 'react-redux';
import { getRoomPlayersCount, getRoomId, getPlayerNicknames, getPlayerIds } from '../../selectors';
import { useSocket } from '../../context';
import React, { useCallback, useEffect, useMemo } from 'react';
import { events } from '../../../shared';
import {
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Box,
    Stack,
    Typography,
    Paper,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
} from '@mui/material';
import { People, ExitToApp, PlayArrow, Person } from '@mui/icons-material';

type GameLobbyProps = {
    minNumberOfPlayers: number;
    maxNumberOfPlayers: number;
    GameOptionsFormComponent?: React.ComponentType<any>;
    gameOptions?: Record<string, any>;
    setGameOptions?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    title?: string;
};

/**
 * GameLobby component that displays the game lobby.
 * @param minNumberOfPlayers - The minimum number of players required to start the game.
 * @param maxNumberOfPlayers - The maximum number of players allowed in the game.
 * @param GameOptionsFormComponent - The component that displays the game options.
 * @param gameOptions - The game options.
 * @param setGameOptions - The function to set the game options.
 * @param title - The title of the game.
 */
export const GameLobby: React.FC<GameLobbyProps> = ({
    minNumberOfPlayers,
    maxNumberOfPlayers,
    GameOptionsFormComponent,
    gameOptions = {},
    setGameOptions,
    title,
}) => {
    const numberOfPlayers = useSelector(getRoomPlayersCount);
    const roomId = useSelector(getRoomId)!;
    const playerNicknames = useSelector(getPlayerNicknames);
    const playerIds = useSelector(getPlayerIds);
    const socket = useSocket();

    const isHost = useMemo(() => playerIds[0] === socket?.id, [playerIds, socket]);

    const onGameStart = useCallback(() => {
        socket?.emit(events.rooms.GAME_START, { gameOptions });
    }, [socket, gameOptions]);

    const onRoomLeave = useCallback(() => {
        socket?.emit(events.rooms.DISCONNECT_FROM_ROOM);
    }, [socket]);

    // Update game options when the host changes them
    useEffect(() => {
        if (!isHost && setGameOptions) {
            socket?.on(events.rooms.OPTIONS_CHANGED, (gameOptions) => {
                setGameOptions(gameOptions);
            });
        }

        return () => {
            if (!isHost && setGameOptions) {
                socket?.off(events.rooms.OPTIONS_CHANGED);
            }
        };
    }, [isHost, setGameOptions, socket]);

    useEffect(() => {
        if (isHost) {
            socket?.emit(events.rooms.OPTIONS_CHANGED, { gameOptions });
        }
    }, [isHost, gameOptions, socket]);

    const playerProgress = (numberOfPlayers / maxNumberOfPlayers) * 100;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card elevation={3}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4">{`${title ?? 'Game'} Lobby`}</Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<ExitToApp />}
                            onClick={onRoomLeave}
                        >
                            Leave Room
                        </Button>
                    </Box>

                    <Paper elevation={0} sx={{ bgcolor: 'background.default', p: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Room ID: {roomId}
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    Players ({numberOfPlayers}/{maxNumberOfPlayers})
                                </Typography>
                                <LinearProgress
                                    color={
                                        numberOfPlayers >= minNumberOfPlayers ? 'success' : 'error'
                                    }
                                    variant="determinate"
                                    value={playerProgress}
                                    sx={{ height: 8, borderRadius: 4 }}
                                />
                            </Box>
                            <Typography>
                                {isHost
                                    ? 'You are the host. You can change the game options and start the game when ready.'
                                    : 'Waiting for the host to start the game...'}
                            </Typography>

                            <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                                <Typography variant="h6" sx={{ m: 2 }}>
                                    Connected Players
                                </Typography>
                                {playerNicknames.map((playerNickname, i) => (
                                    <ListItem key={playerNickname}>
                                        <ListItemIcon>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                <Person />
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={playerNickname}
                                            secondary={`${
                                                playerIds[i] === socket?.id ? '(You)' : ''
                                            } ${i === 0 ? '(Host)' : ''}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>

                            <Box display="flex" gap={2}>
                                <Paper sx={{ flex: 1, p: 2, bgcolor: 'background.paper' }}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <People color="primary" />
                                        <Typography>Min Players: {minNumberOfPlayers}</Typography>
                                    </Box>
                                </Paper>
                                <Paper sx={{ flex: 1, p: 2, bgcolor: 'background.paper' }}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <People color="primary" />
                                        <Typography>Max Players: {maxNumberOfPlayers}</Typography>
                                    </Box>
                                </Paper>
                            </Box>
                        </Stack>
                    </Paper>

                    {GameOptionsFormComponent && (
                        <Box mb={3}>
                            <Typography variant="h6" gutterBottom>
                                Game Options
                            </Typography>
                            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                <GameOptionsFormComponent
                                    gameOptions={gameOptions}
                                    setGameOptions={setGameOptions}
                                />
                            </Paper>
                        </Box>
                    )}

                    <Box display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<PlayArrow />}
                            onClick={onGameStart}
                            disabled={numberOfPlayers < minNumberOfPlayers || !isHost}
                            sx={{ px: 4, py: 1.5 }}
                        >
                            Start Game
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};
