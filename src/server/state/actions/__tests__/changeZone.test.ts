import changeZone, { ChangeZonePayload } from '../changeZone';
import { getCard, getInitialGameState, getMeta } from '../testUtils';
import { StateContext } from '../../../types';

const initialState = getInitialGameState({
    zones: {
        zone1: {
            id: 'zone1',
            name: 'zone1',
            cards: [getCard('card1')],
        },
        zone2: {
            id: 'zone2',
            name: 'zone2',
            cards: [getCard('card2')],
        },
    },
});
const ctxMock: Partial<
    StateContext<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>
> = {
    getState: jest.fn(() => initialState),
};

describe('changeZone action', () => {
    it('should change the zone if zones are valid and there is the wanted card', () => {
        const payload: ChangeZonePayload = {
            cardId: 'card1',
            fromZoneId: 'zone1',
            toZoneId: 'zone2',
        };
        const result = changeZone.apply(
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
                    cards: [],
                },
                zone2: {
                    id: 'zone2',
                    name: 'zone2',
                    cards: [getCard('card2'), getCard('card1')],
                },
            },
        });
        expect(result.coreState.zones).toEqual(expectedState.coreState.zones);
        expect(result).toEqual(expectedState);
    });
    it('should return the same state if wanted card does not exist', () => {
        const payload: ChangeZonePayload = {
            cardId: 'card3',
            fromZoneId: 'zone1',
            toZoneId: 'zone2',
        };
        const result = changeZone.apply(
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
    it('should return the same state if from zone does not exist', () => {
        const payload: ChangeZonePayload = {
            cardId: 'card1',
            fromZoneId: 'zone3',
            toZoneId: 'zone2',
        };
        const result = changeZone.apply(
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
    it('should return the same state if to zone does not exist', () => {
        const payload: ChangeZonePayload = {
            cardId: 'card1',
            fromZoneId: 'zone1',
            toZoneId: 'zone3',
        };
        const result = changeZone.apply(
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
