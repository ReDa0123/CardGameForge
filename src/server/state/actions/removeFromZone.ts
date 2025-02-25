import { ActionTemplate } from '../../types';
import { actionTypes } from './actionTypes';
import { assocByDotPath } from './utils';

export type RemoveFromZonePayload = {
    cardIds: string | string[];
    fromZoneId: string;
};

/**
 * Action to remove a card or cards from a zone.
 * Payload - An object with the card IDs to remove and the ID of the zone to remove them from.
 */
const removeFromZone: ActionTemplate<RemoveFromZonePayload> = {
    name: actionTypes.REMOVE_FROM_ZONE,
    apply: (payload, ctx, meta) => {
        const cardIds = Array.isArray(payload.cardIds) ? payload.cardIds : [payload.cardIds];
        const fromZoneId = payload.fromZoneId;
        const state = ctx.getState();
        const fromZone = state.coreState.zones[fromZoneId];
        if (!fromZone) {
            if (ctx.loadedConfig?.logErrors) {
                console.error(`${meta.roomId}: Zone ${fromZoneId} does not exist`);
            }
            return { ...state };
        }
        return assocByDotPath(
            state,
            `coreState.zones.${fromZoneId}.cards`,
            fromZone.cards.filter((card) => !cardIds.includes(card.id))
        );
    },
};

export default removeFromZone;
