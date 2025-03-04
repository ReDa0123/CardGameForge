import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, NetworkState, SelectCardPayload } from '../types';

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
        ): GameState<any, any, any, any> => {
            return {
                ...action.payload,
                coreState: {
                    ...action.payload.coreState,
                    selection: state.coreState.selection,
                },
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
