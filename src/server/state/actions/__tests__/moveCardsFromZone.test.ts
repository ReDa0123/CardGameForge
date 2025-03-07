import moveCardsFromZone, { MoveCardsFromZonePayload } from '../moveCardsFromZone';
import { getCard, getInitialGameState, getMeta } from '../testUtils';
import { StateContext } from '../../../types';

const initialState = getInitialGameState({
    zones: {
        zone1: {
            id: 'zone1',
            name: 'zone1',
            cards: [getCard('card1'), getCard('card2'), getCard('card3'), getCard('card4')],
        },
        zone2: {
            id: 'zone2',
            name: 'zone2',
            cards: [getCard('card5')],
        },
        emptyZone: {
            id: 'emptyZone',
            name: 'emptyZone',
            cards: [],
        },
    },
});

const ctxMock: Partial<
    StateContext<Record<string, any>, Record<string, any>, Record<string, any>, Record<string, any>>
> = {
    getState: jest.fn(() => initialState),
};

describe('moveCardsFromZone action', () => {
    it('should move all cards from source zone to destination zone when numberOfCards is not provided', () => {
        const payload: MoveCardsFromZonePayload = {
            fromZoneId: 'zone1',
            toZoneId: 'zone2',
        };
        const result = moveCardsFromZone.apply(
            payload,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            getMeta()
        );

        expect(result.coreState.zones.zone1.cards).toHaveLength(0);
        expect(result.coreState.zones.zone2.cards).toHaveLength(5);
        expect(result.coreState.zones.zone2.cards).toEqual([
            getCard('card5'),
            getCard('card1'),
            getCard('card2'),
            getCard('card3'),
            getCard('card4'),
        ]);
    });

    it('should move specified number of cards from source zone to destination zone', () => {
        const payload: MoveCardsFromZonePayload = {
            fromZoneId: 'zone1',
            toZoneId: 'zone2',
            numberOfCards: 2,
        };
        const result = moveCardsFromZone.apply(
            payload,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            getMeta()
        );

        expect(result.coreState.zones.zone1.cards).toHaveLength(2);
        expect(result.coreState.zones.zone2.cards).toHaveLength(3);
        expect(result.coreState.zones.zone1.cards).toEqual([getCard('card3'), getCard('card4')]);
        expect(result.coreState.zones.zone2.cards).toEqual([
            getCard('card5'),
            getCard('card1'),
            getCard('card2'),
        ]);
    });

    it('should handle moving from empty zone', () => {
        const payload: MoveCardsFromZonePayload = {
            fromZoneId: 'emptyZone',
            toZoneId: 'zone2',
        };
        const result = moveCardsFromZone.apply(
            payload,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            getMeta()
        );

        expect(result.coreState.zones.emptyZone.cards).toHaveLength(0);
        expect(result.coreState.zones.zone2.cards).toHaveLength(1);
        expect(result.coreState.zones.zone2.cards).toEqual([getCard('card5')]);
    });

    it('should handle moving more cards than available', () => {
        const payload: MoveCardsFromZonePayload = {
            fromZoneId: 'zone1',
            toZoneId: 'zone2',
            numberOfCards: 10,
        };
        const result = moveCardsFromZone.apply(
            payload,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            getMeta()
        );

        expect(result.coreState.zones.zone1.cards).toHaveLength(0);
        expect(result.coreState.zones.zone2.cards).toHaveLength(5);
        expect(result.coreState.zones.zone2.cards).toEqual([
            getCard('card5'),
            getCard('card1'),
            getCard('card2'),
            getCard('card3'),
            getCard('card4'),
        ]);
    });

    it('should return the same state if source zone does not exist', () => {
        const payload: MoveCardsFromZonePayload = {
            fromZoneId: 'nonexistentZone',
            toZoneId: 'zone2',
        };
        const result = moveCardsFromZone.apply(
            payload,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            getMeta()
        );
        expect(result).toEqual(initialState);
    });

    it('should return the same state if destination zone does not exist', () => {
        const payload: MoveCardsFromZonePayload = {
            fromZoneId: 'zone1',
            toZoneId: 'nonexistentZone',
        };
        const result = moveCardsFromZone.apply(
            payload,
            ctxMock as StateContext<
                Record<string, any>,
                Record<string, any>,
                Record<string, any>,
                Record<string, any>
            >,
            getMeta()
        );
        expect(result).toEqual(initialState);
    });
});
