import shuffleZone from '../shuffleZone';
import { getCard, getInitialGameState, getMeta } from '../testUtils';
import { StateContext } from '../../../types/gameState';

const zoneId = 'zone1';
const cards = [getCard('card1'), getCard('card2'), getCard('card3')];
const initialState = getInitialGameState({
    zones: {
        [zoneId]: {
            id: zoneId,
            name: zoneId,
            cards,
        },
    },
});

const mockShuffledCards = [getCard('card3'), getCard('card1'), getCard('card2')];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const randomizeMock = <T>(arr: T[]): T[] => mockShuffledCards as T[];

const ctxMock: Partial<StateContext<unknown, unknown, Record<string, any>, Record<string, any>>> = {
    getState: jest.fn(() => initialState),
    randomize: jest.fn(randomizeMock) as <T>(arr: T[]) => T[],
};

describe('shuffleZone', () => {
    it('should shuffle the cards in a zone', () => {
        const result = shuffleZone.apply(
            zoneId,
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        const expectedState = getInitialGameState({
            zones: {
                [zoneId]: {
                    id: zoneId,
                    name: zoneId,
                    cards: mockShuffledCards,
                },
            },
        });
        expect(result.coreState.zones[zoneId].cards).toEqual(mockShuffledCards);
        expect(result).toEqual(expectedState);
    });
    it('should return the same state if the zone does not exist', () => {
        const result = shuffleZone.apply(
            'zone3',
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        expect(result.coreState.zones[zoneId].cards).toEqual(cards);
        expect(result).toEqual(initialState);
    });
});
