import { ReduxState } from '../types';
import { createSelector } from '@reduxjs/toolkit';

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
export const getHistoryMessages = createSelector(
    (state: ReduxState<any, any, any, any>) => state.game.coreState.history,
    (history) => history.filter((record) => !!record.message).map((record) => record.message!)
);

/**
 * Selector to get the history messages with timestamps from the redux state.
 * @param state - The redux state
 * @returns The history messages with timestamps
 */
export const getHistoryMessagesWithTimestamps = createSelector(
    (state: ReduxState<any, any, any, any>) => state.game.coreState.history,
    (history) => {
        const historyWithMessages = history.filter((record) => !!record.message);
        return historyWithMessages.map((record) => {
            const timestamp = new Date(record.meta.timestamp);
            const message = record.message!;
            return `${timestamp.toLocaleTimeString()}: ${message}`;
        });
    }
);
