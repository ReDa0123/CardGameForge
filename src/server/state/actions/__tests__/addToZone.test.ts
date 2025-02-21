import addToZone from '../addToZone';
import { getCard, getInitialGameState, getMeta } from '../testUtils';
import { StateContext } from '../../../types/gameState';

const initialState = getInitialGameState({
    zones: {
        zone1: {
            id: 'zone1',
            name: 'zone1',
            cards: [getCard('card1')],
        },
    },
});

const ctxMock: Partial<StateContext<unknown, unknown, Record<string, any>, Record<string, any>>> = {
    getState: jest.fn(() => initialState),
};

describe('addToZone action', () => {
    it('should add a single card to a zone if zone exists', () => {
        const newCard = getCard('card2');

        const result = addToZone.apply(
            {
                cards: newCard,
                toZoneId: 'zone1',
            },
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        const expectedState = getInitialGameState({
            zones: {
                zone1: {
                    id: 'zone1',
                    name: 'zone1',
                    cards: [getCard('card1'), newCard],
                },
            },
        });
        expect(result.coreState.zones.zone1.cards).toEqual([getCard('card1'), newCard]);
        expect(result).toEqual(expectedState);
    });
    it('should add a multiple cards to a zone if zone exists', () => {
        const newCards = [getCard('card2'), getCard('card3')];

        const result = addToZone.apply(
            {
                cards: newCards,
                toZoneId: 'zone1',
            },
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );

        const expectedState = getInitialGameState({
            zones: {
                zone1: {
                    id: 'zone1',
                    name: 'zone1',
                    cards: [getCard('card1'), ...newCards],
                },
            },
        });
        expect(result.coreState.zones.zone1.cards).toEqual([getCard('card1'), ...newCards]);
        expect(result).toEqual(expectedState);
    });
    it('should return the same state if zone does not exist', () => {
        const newCards = [getCard('card2'), getCard('card3')];
        const result = addToZone.apply(
            {
                cards: newCards,
                toZoneId: 'zone2',
            },
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        expect(result.coreState.zones.zone1.cards).toEqual([getCard('card1')]);
        expect(result).toEqual(initialState);
    });
});
