import { ActionTemplate } from '../../types';
import { actionTypes } from './actionTypes';
import { assocByDotPath } from './utils';

export type ShuffleZonePayload = {
    zoneId: string;
};

/**
 * Action to shuffle the cards in a zone.
 * Payload - The ID of the zone to shuffle.
 */
const shuffleZone: ActionTemplate<ShuffleZonePayload> = {
    name: actionTypes.SHUFFLE_ZONE,
    apply: (payload, ctx, meta) => {
        const state = ctx.getState();
        const zoneId = payload.zoneId;
        const zone = state.coreState.zones[zoneId];
        if (!zone) {
            if (ctx.loadedConfig?.logErrors) {
                console.error(`${meta.roomId}: Zone ${zoneId} does not exist`);
            }
            return { ...state };
        }
        const shuffledCards = ctx.randomize(zone.cards);
        return assocByDotPath(state, `coreState.zones.${zoneId}.cards`, shuffledCards);
    },
};

export default shuffleZone;
