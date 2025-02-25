import { ActionTemplate, Card } from '../../types';
import { actionTypes } from './actionTypes';
import { assocByDotPath } from './utils';

export type AddToZonePayload = {
    cards: Card<Record<string, any>> | Card<Record<string, any>>[];
    toZoneId: string;
};

/**
 * Action to add a card or cards to a zone.
 * Payload - An object with the cards to add and the ID of the zone to add them to.
 */
const addToZone: ActionTemplate<AddToZonePayload> = {
    name: actionTypes.ADD_TO_ZONE,
    apply: (payload, ctx, meta) => {
        const cards = Array.isArray(payload.cards) ? payload.cards : [payload.cards];
        const toZoneId = payload.toZoneId;
        const state = ctx.getState();
        const toZone = state.coreState.zones[toZoneId];
        if (!toZone) {
            if (ctx.loadedConfig?.logErrors) {
                console.error(`${meta.roomId}: Zone ${toZoneId} does not exist`);
            }
            return { ...state };
        }
        return assocByDotPath(state, `coreState.zones.${toZoneId}.cards`, [
            ...toZone.cards,
            ...cards,
        ]);
    },
};

export default addToZone;
