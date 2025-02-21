import { ActionTemplate } from '../../types/gameConfig';
import { actionTypes } from './actionTypes';
import { changeStateValue } from './utils';

type RemoveFromZonePayload = {
    cardIds: string | string[];
    fromZoneId: string;
};

const removeFromZone: ActionTemplate<RemoveFromZonePayload> = {
    name: actionTypes.REMOVE_FROM_ZONE,
    apply: (payload, ctx, meta) => {
        const cardIds = Array.isArray(payload.cardIds) ? payload.cardIds : [payload.cardIds];
        const fromZoneId = payload.fromZoneId;
        const state = ctx.getState();
        const fromZone = state.coreState.zones[fromZoneId];
        if (!fromZone) {
            if (ctx.loadedConfig?.logConnections) {
                console.error(`${meta.roomId}: Zone ${fromZoneId} does not exist`);
            }
            return { ...state };
        }
        return changeStateValue(
            state,
            `coreState.zones.${fromZoneId}.cards`,
            fromZone.cards.filter((card) => !cardIds.includes(card.id))
        );
    },
};

export default removeFromZone;
