import { getHistory, getHistoryMessages, getHistoryMessagesWithTimestamps } from '../history';
import { GameState, ReduxState, History } from '../../types';

describe('history selectors', () => {
    const mockTimestamp = new Date('2024-03-04T12:00:00');
    const mockHistory: History[] = [
        {
            recordType: 'ACTION',
            message: 'First message',
            meta: { timestamp: mockTimestamp },
        },
        {
            recordType: 'ACTION',
            message: 'Second message',
            meta: { timestamp: new Date(mockTimestamp.getTime() + 1000) },
        },
        {
            recordType: 'ACTION',
            meta: { timestamp: new Date(mockTimestamp.getTime() + 2000) },
        },
    ];

    const mockGameState: Partial<GameState<any, any, any, any>> = {
        coreState: {
            history: mockHistory,
        } as GameState<any, any, any, any>['coreState'],
    };

    const mockState: ReduxState<any, any, any, any> = {
        game: {
            ...(mockGameState as GameState<any, any, any, any>),
        },
    };

    describe('getHistory', () => {
        it('should return the entire history array', () => {
            const result = getHistory(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual(mockHistory);
            expect(result).toHaveLength(3);
        });
    });

    describe('getHistoryMessages', () => {
        it('should return only messages from history records', () => {
            const result = getHistoryMessages(mockState as ReduxState<any, any, any, any>);
            expect(result).toEqual(['First message', 'Second message']);
            expect(result).toHaveLength(2);
        });

        it('should return empty array when no messages exist', () => {
            const emptyState = {
                ...mockState,
                game: {
                    ...mockState.game,
                    coreState: { ...mockState.game.coreState, history: [] },
                },
            };
            const result = getHistoryMessages(emptyState as ReduxState<any, any, any, any>);
            expect(result).toEqual([]);
        });
    });

    describe('getHistoryMessagesWithTimestamps', () => {
        it('should return messages with timestamps', () => {
            const result = getHistoryMessagesWithTimestamps(
                mockState as ReduxState<any, any, any, any>
            );
            expect(result).toEqual([
                `${mockTimestamp.toLocaleTimeString()}: First message`,
                `${new Date(mockTimestamp.getTime() + 1000).toLocaleTimeString()}: Second message`,
            ]);
            expect(result).toHaveLength(2);
        });

        it('should return empty array when no messages exist', () => {
            const emptyState = {
                ...mockState,
                game: {
                    ...mockState.game,
                    coreState: { ...mockState.game.coreState, history: [] },
                },
            };
            const result = getHistoryMessagesWithTimestamps(
                emptyState as ReduxState<any, any, any, any>
            );
            expect(result).toEqual([]);
        });
    });
});
