import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, NetworkState } from '../types/gameState';
import { SelectCardPayload } from '../types/context';

const initialGameState: GameState<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
> = {
    coreState: {
        gameInProgress: false,
        endResult: null,
        phase: '',
        turnOrder: {
            activePlayer: '',
            nextPlayer: '',
            playOrder: [],
            activePlayerIndex: 0,
        },
        teams: null,
        cardCollection: [],
        zones: {},
        history: [],
        randomSeed: undefined,
        selection: {},
    },
    customState: {},
    gameOptions: {},
    networkState: {},
};

const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        updateGameState: (
            state: GameState<any, any, any, any>,
            action: PayloadAction<
                GameState<
                    Record<string, any>,
                    Record<string, any>,
                    Record<string, any>,
                    Record<string, any>
                >
            >
        ) => {
            return {
                ...action.payload,
                networkState: {
                    ...action.payload.networkState,
                    playerId: state.networkState!.playerId,
                    playerNickname: state.networkState!.playerNickname,
                },
            };
        },
        selectCard: (
            state: GameState<any, any, any, any>,
            action: PayloadAction<SelectCardPayload>
        ) => {
            state.coreState.selection = {
                ...state.coreState.selection,
                [action.payload.zoneId]: [
                    ...(state.coreState.selection[action.payload.zoneId] || []),
                    action.payload.cardId,
                ],
            };
        },
        unselectCard: (
            state: GameState<any, any, any, any>,
            action: PayloadAction<SelectCardPayload>
        ) => {
            state.coreState.selection = {
                ...state.coreState.selection,
                [action.payload.zoneId]: (
                    state.coreState.selection[action.payload.zoneId] || []
                ).filter((cardId) => cardId !== action.payload.cardId),
            };
        },
        unselectZone: (state: GameState<any, any, any, any>, action: PayloadAction<string>) => {
            delete state.coreState.selection[action.payload];
        },
        unselectAll: (state: GameState<any, any, any, any>) => {
            state.coreState.selection = {};
        },
        setNetworkState: (
            state: GameState<any, any, any, any>,
            action: PayloadAction<NetworkState>
        ) => {
            if (state.coreState.gameInProgress && !action.payload.roomId) {
                state = initialGameState;
            }
            state.networkState = action.payload;
        },
        setClientId: (state: GameState<any, any, any, any>, action: PayloadAction<string>) => {
            state.networkState!.playerId = action.payload;
        },
        setClientNickname: (
            state: GameState<any, any, any, any>,
            action: PayloadAction<string>
        ) => {
            state.networkState!.playerNickname = action.payload;
        },
        resetClientNickname: (state: GameState<any, any, any, any>) => {
            state.networkState!.playerNickname = undefined;
        },
        leaveRoom: (state: GameState<any, any, any, any>) => {
            state.networkState = {
                playerId: state.networkState!.playerId,
            };
        },
    },
});

export const {
    updateGameState,
    selectCard,
    unselectCard,
    unselectZone,
    unselectAll,
    setNetworkState,
    setClientId,
    setClientNickname,
    resetClientNickname,
    leaveRoom,
} = gameSlice.actions;

export default gameSlice.reducer;
