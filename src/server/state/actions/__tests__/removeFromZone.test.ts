import removeFromZone from '../removeFromZone';
import { getCard, getInitialGameState, getMeta } from '../testUtils';
import { StateContext } from '../../../types';

describe('removeFromZone action', () => {
    it('should remove a single card from a zone if zone exists', () => {
        const initialState = getInitialGameState({
            zones: {
                zone1: {
                    id: 'zone1',
                    name: 'zone1',
                    cards: [getCard('card1'), getCard('card2')],
                },
            },
        });
        const ctxMock: Partial<
            StateContext<unknown, unknown, Record<string, any>, Record<string, any>>
        > = {
            getState: jest.fn(() => initialState),
        };
        const result = removeFromZone.apply(
            {
                cardIds: 'card1',
                fromZoneId: 'zone1',
            },
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        const expectedState = getInitialGameState({
            zones: {
                zone1: {
                    id: 'zone1',
                    name: 'zone1',
                    cards: [getCard('card2')],
                },
            },
        });
        expect(result.coreState.zones.zone1.cards).toEqual([getCard('card2')]);
        expect(result).toEqual(expectedState);
    });
    it('should remove a multiple cards from a zone if zone exists', () => {
        const initialState = getInitialGameState({
            zones: {
                zone1: {
                    id: 'zone1',
                    name: 'zone1',
                    cards: [getCard('card1'), getCard('card2')],
                },
            },
        });
        const ctxMock: Partial<
            StateContext<unknown, unknown, Record<string, any>, Record<string, any>>
        > = {
            getState: jest.fn(() => initialState),
        };
        const result = removeFromZone.apply(
            {
                cardIds: ['card1', 'card2'],
                fromZoneId: 'zone1',
            },
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        const expectedState = getInitialGameState({
            zones: {
                zone1: {
                    id: 'zone1',
                    name: 'zone1',
                    cards: [],
                },
            },
        });
        expect(result.coreState.zones.zone1.cards).toEqual([]);
        expect(result).toEqual(expectedState);
    });
    it('should remove a single card from a zone if zone exists and you want to delete multiple cards but some does not exist', () => {
        const initialState = getInitialGameState({
            zones: {
                zone1: {
                    id: 'zone1',
                    name: 'zone1',
                    cards: [getCard('card1'), getCard('card2')],
                },
            },
        });
        const ctxMock: Partial<
            StateContext<unknown, unknown, Record<string, any>, Record<string, any>>
        > = {
            getState: jest.fn(() => initialState),
        };
        const result = removeFromZone.apply(
            {
                cardIds: ['card1', 'card3'],
                fromZoneId: 'zone1',
            },
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        const expectedState = getInitialGameState({
            zones: {
                zone1: {
                    id: 'zone1',
                    name: 'zone1',
                    cards: [getCard('card2')],
                },
            },
        });
        expect(result.coreState.zones.zone1.cards).toEqual([getCard('card2')]);
        expect(result).toEqual(expectedState);
    });
    it('should return the same state if zone exists and you want to delete a card but it does not exist', () => {
        const initialState = getInitialGameState({
            zones: {
                zone1: {
                    id: 'zone1',
                    name: 'zone1',
                    cards: [getCard('card1'), getCard('card2')],
                },
            },
        });
        const ctxMock: Partial<
            StateContext<unknown, unknown, Record<string, any>, Record<string, any>>
        > = {
            getState: jest.fn(() => initialState),
        };
        const result = removeFromZone.apply(
            {
                cardIds: 'card3',
                fromZoneId: 'zone1',
            },
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        const expectedState = getInitialGameState({
            zones: {
                zone1: {
                    id: 'zone1',
                    name: 'zone1',
                    cards: [getCard('card1'), getCard('card2')],
                },
            },
        });
        expect(result.coreState.zones.zone1.cards).toEqual([getCard('card1'), getCard('card2')]);
        expect(result).toEqual(expectedState);
    });
    it('should return the same state if zone does not exist', () => {
        const initialState = getInitialGameState({
            zones: {
                zone1: {
                    id: 'zone1',
                    name: 'zone1',
                    cards: [getCard('card1'), getCard('card2')],
                },
            },
        });
        const ctxMock: Partial<
            StateContext<unknown, unknown, Record<string, any>, Record<string, any>>
        > = {
            getState: jest.fn(() => initialState),
        };
        const result = removeFromZone.apply(
            {
                cardIds: 'card1',
                fromZoneId: 'zone2',
            },
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        expect(result.coreState.zones.zone1.cards).toEqual([getCard('card1'), getCard('card2')]);
        expect(result).toEqual(initialState);
    });
});
