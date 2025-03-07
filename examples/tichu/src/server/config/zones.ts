import { ConfigZone } from 'cardgameforge/server';
import { ZONES } from '../constants';

export const zones: ConfigZone<any>[] = [
    {
        zoneId: ZONES.PLAYED_CARDS,
        zoneName: 'Played cards',
    },
    {
        zoneId: ZONES.START_DECK,
        zoneName: 'Deck',
    },
    {
        zoneId: ZONES.HAND,
        zoneName: 'Hand',
        isPerPlayer: true,
    },
    {
        zoneId: ZONES.COLLECTED,
        zoneName: 'Collected cards',
        isPerPlayer: true,
    },
];
