import { ReduxState } from '../types';

/**
 * Selector to get the history from the redux state.
 * @param state - The redux state
 * @returns The history
 */
export const getHistory = (state: ReduxState<any, any, any, any>) => state.game.coreState.history;

/**
 * Selector to get the history messages from the redux state.
 * @param state - The redux state
 * @returns The history messages
 */
export const getHistoryMessages = (state: ReduxState<any, any, any, any>): string[] => {
    return state.game.coreState.history
        .filter((record) => !!record.message)
        .map((record) => record.message!);
};

/**
 * Selector to get the history messages with timestamps from the redux state.
 * @param state - The redux state
 * @returns The history messages with timestamps
 */
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
