import appendHistory from '../appendHistory';
import { HistoryRecord, StateContext } from '../../../types';
import { getInitialGameState, getMeta } from '../testUtils';

describe('appendHistory action', () => {
    it('should append a new history record to state.coreState.history', () => {
        const meta = getMeta();
        const initialState = getInitialGameState({
            history: [{ recordType: 'MOVE', payload: {}, meta }],
        });
        const ctxMock: Partial<
            StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >
        > = {
            getState: jest.fn(() => initialState),
        };
        const newRecord = {
            recordType: 'MOVE',
            payload: { a: 'sa' },
            meta: { roomId: '', timestamp: new Date() },
        } as HistoryRecord<unknown>;
        const result = appendHistory.apply(
            newRecord,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            meta
        );
        const expectedState = getInitialGameState({
            history: [{ recordType: 'MOVE', payload: {}, meta }, newRecord],
        });

        expect(result.coreState.history).toHaveLength(2);
        expect(result.coreState.history[1]).toEqual(newRecord);
        expect(result).toEqual(expectedState);
    });
});
