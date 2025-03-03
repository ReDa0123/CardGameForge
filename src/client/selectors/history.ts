import { ReduxState } from '../types/gameState';

export const getHistoryMessages = (state: ReduxState<any, any, any, any>): string[] => {
    return state.game.coreState.history
        .filter((record) => !!record.message)
        .map((record) => record.message!);
};

export const getHistoryMessagesWithTimestamps = (
    state: ReduxState<any, any, any, any>
): string[] => {
    const historyWithMessages = state.game.coreState.history.filter((record) => !!record.message);
    return historyWithMessages.map((record) => {
        const timestamp: Date = record.meta.timestamp;
        const message = record.message!;
        return `${timestamp.toLocaleTimeString()}: ${message}`;
    });
};
