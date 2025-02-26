import changeCard, { ChangeCardPayload } from '../changeCard';
import { getCard, getInitialGameState, getMeta } from '../testUtils';
import { StateContext } from '../../../types';

const initialState = getInitialGameState({
    zones: {
        zone1: {
            id: 'zone1',
            name: 'zone1',
            cards: [getCard('card1')],
        },
    },
});

const ctxMock: Partial<
    StateContext<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>
> = {
    getState: jest.fn(() => initialState),
};

describe('changeCard action', () => {
    it('should change a whole card in a zone', () => {
        const card2 = getCard('card2');
        const payload: ChangeCardPayload = {
            cardId: 'card1',
            zoneId: 'zone1',
            cardChanges: { ...card2, state: { foo: 'bar' } },
        };
        const result = changeCard.apply(
            payload,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            getMeta()
        );
        const expectedState = getInitialGameState({
            zones: {
                zone1: {
                    id: 'zone1',
                    name: 'zone1',
                    cards: [{ ...card2, state: { foo: 'bar' } }],
                },
            },
        });

        expect(result.coreState.zones).toEqual(expectedState.coreState.zones);
        expect(result).toEqual(expectedState);
    });
    it('should change a field of a card in a zone', () => {
        const payload: ChangeCardPayload = {
            cardId: 'card1',
            zoneId: 'zone1',
            cardChanges: { templateId: 'card2' },
        };
        const result = changeCard.apply(
            payload,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            getMeta()
        );
        const expectedState = getInitialGameState({
            zones: {
                zone1: {
                    id: 'zone1',
                    name: 'zone1',
                    cards: [{ ...getCard('card1'), templateId: 'card2' }],
                },
            },
        });

        expect(result.coreState.zones).toEqual(expectedState.coreState.zones);
        expect(result).toEqual(expectedState);
    });
    it('should return the same state if the zone does not exist', () => {
        const payload: ChangeCardPayload = {
            cardId: 'card1',
            zoneId: 'zone2',
            cardChanges: { templateId: 'card2' },
        };
        const result = changeCard.apply(
            payload,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            getMeta()
        );

        expect(result.coreState.zones).toEqual(initialState.coreState.zones);
        expect(result).toEqual(initialState);
    });
    it('should return the same state if the card does not exist in the zone', () => {
        const payload: ChangeCardPayload = {
            cardId: 'card2',
            zoneId: 'zone1',
            cardChanges: { templateId: 'card2' },
        };
        const result = changeCard.apply(
            payload,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            getMeta()
        );

        expect(result.coreState.zones).toEqual(initialState.coreState.zones);
        expect(result).toEqual(initialState);
    });
});
