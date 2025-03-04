import { configureStore } from '@reduxjs/toolkit';
import gameReducer, { leaveRoom, setClientId, setNetworkState, updateGameState } from './gameSlice';
import React, { createContext, useContext, useEffect } from 'react';
import { GameContextType, NetworkState, GameContextProviderProps } from '../types';
import { Provider, useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { events } from '../../shared/constants/events';
import { SnackbarProvider } from 'notistack';
import { useNotification } from '../hooks';
import { createTheme, ThemeProvider } from '@mui/material';

const store = configureStore({
    reducer: {
        game: gameReducer,
    },
    devTools: true,
});

const DefaultComponent: React.FC = () => null;

const gameContext = createContext<GameContextType>({
    displayRegistry: {
        default: DefaultComponent,
    },
    socket: null,
});

const GameProvider = gameContext.Provider;

const GameContextInner: React.FC<Omit<GameContextProviderProps, 'materialTheme'>> = ({
    displayRegistry,
    serverAddress,
    children,
}) => {
    const dispatch = useDispatch();
    const notify = useNotification();
    const [socket, setSocket] = React.useState<Socket | null>(null);

    useEffect(() => {
        const socketFromIo = io(serverAddress);

        socketFromIo.on('connect', () => {
            setSocket(socketFromIo);
            dispatch(setClientId(socketFromIo.id!));
        });

        return () => {
            socketFromIo.disconnect();
        };
    }, [dispatch, serverAddress]);

    useEffect(() => {
        if (socket) {
            // Listen fir join room errors
            socket.on(events.rooms.INVALID_ROOM_INPUT, () => {
                notify('Select a room to join and provide a nickname', 'error');
            });

            socket.on(events.rooms.ROOM_FULL, () => {
                notify('The room is full', 'error');
            });

            socket.on(events.rooms.NICKNAME_TAKEN, () => {
                notify('The nickname is taken in that room', 'error');
            });

            socket.on(events.rooms.INVALID_NUMBER_OF_PLAYERS, (message: string) => {
                notify(message, 'error');
            });

            // Listen for room state changes
            socket.on(
                events.rooms.ROOM_STATE_CHANGED,
                (roomState: Pick<NetworkState, 'roomId' | 'players'>) => {
                    const clientNetworkState: NetworkState = {
                        ...roomState,
                        playerNickname: roomState.players!.find(
                            (player) => player.playerId === socket.id
                        )?.playerNickname,
                        playerId: socket.id,
                    };
                    dispatch(setNetworkState(clientNetworkState));
                }
            );

            socket.on(events.rooms.RESET_NETWORK_STATE, () => {
                dispatch(leaveRoom());
                notify(
                    'A player left the game, you have been disconnected from the room',
                    'warning'
                );
            });

            // Listen for state changes
            socket.on(events.GAME_STATE_CHANGED, (gameState) => {
                dispatch(updateGameState(gameState));
            });

            // Listen for move failures
            socket.on(events.MOVE_FAILED, (reason: string) => {
                notify(`Can't perform move: ${reason}`, 'error');
            });

            return () => {
                socket.off(events.rooms.INVALID_ROOM_INPUT);
                socket.off(events.rooms.ROOM_FULL);
                socket.off(events.rooms.NICKNAME_TAKEN);
                socket.off(events.rooms.INVALID_NUMBER_OF_PLAYERS);
                socket.off(events.rooms.ROOM_STATE_CHANGED);
                socket.off(events.GAME_STATE_CHANGED);
                socket.off(events.MOVE_FAILED);
            };
        }
    }, [dispatch, notify, socket]);

    return <GameProvider value={{ displayRegistry, socket }}>{children}</GameProvider>;
};

const defaultMaterialTheme = createTheme({});

export const GameContextProvider: React.FC<GameContextProviderProps> = ({
    displayRegistry,
    children,
    serverAddress,
    materialTheme,
}) => {
    const theme = materialTheme || defaultMaterialTheme;
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <SnackbarProvider
                    autoHideDuration={3000}
                    maxSnack={3}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <GameContextInner
                        displayRegistry={displayRegistry}
                        serverAddress={serverAddress}
                    >
                        {children}
                    </GameContextInner>
                </SnackbarProvider>
            </ThemeProvider>
        </Provider>
    );
};

export const useGameContext = () => useContext(gameContext);

export const useSocket = () => {
    const { socket } = useGameContext();
    return socket;
};
