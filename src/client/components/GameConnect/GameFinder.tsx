import React, { ChangeEvent, useCallback, useState } from 'react';
import { useSocket } from '../../context';
import { events, JoinRoomArgs } from '../../../shared';
import {
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    TextField,
    Typography,
    Box,
} from '@mui/material';
import { SportsEsports } from '@mui/icons-material';

type GameFinderProps = {
    title?: string;
};

/**
 * GameFinder component that allows a player to join a room.
 * @param title - The title of the game.
 */
export const GameFinder: React.FC<GameFinderProps> = ({ title }) => {
    const socket = useSocket();
    const [roomId, setRoomId] = useState('');
    const [nickname, setNickname] = useState('');

    const handleJoinRoom = useCallback(() => {
        const joinRoomArgs: JoinRoomArgs = { roomId, nickname };
        socket?.emit(events.rooms.JOIN_ROOM, joinRoomArgs as any);
    }, [roomId, nickname, socket]);

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Card elevation={3}>
                <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                        <SportsEsports sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        {title && (
                            <Typography variant="h3" gutterBottom>
                                {title}
                            </Typography>
                        )}
                        <Typography variant="h4" gutterBottom>
                            Join Game Room
                        </Typography>
                        <Typography variant="body1" color="text.secondary" textAlign="center">
                            Enter a room ID and your nickname to join the game
                        </Typography>
                    </Box>

                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Room ID"
                            variant="outlined"
                            value={roomId}
                            placeholder="Enter room ID"
                            onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                                setRoomId(e.target.value)
                            }
                        />
                        <TextField
                            fullWidth
                            label="Nickname"
                            variant="outlined"
                            value={nickname}
                            placeholder="Choose your nickname"
                            onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                                setNickname(e.target.value)
                            }
                        />
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleJoinRoom}
                            disabled={!roomId || !nickname}
                            sx={{
                                mt: 2,
                                py: 1.5,
                                fontSize: '1.1rem',
                            }}
                        >
                            Join Game
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
};
