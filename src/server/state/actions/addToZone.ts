import { ActionTemplate } from '../../types/gameConfig';
import { actionTypes } from './actionTypes';
import { changeStateValue } from './utils';
import { Card } from '../../types/gameObjects';

type AddToZonePayload = {
    cards: Card<Record<string, any>> | Card<Record<string, any>>[];
    toZoneId: string;
};

const addToZone: ActionTemplate<AddToZonePayload> = {
    name: actionTypes.ADD_TO_ZONE,
    apply: (payload, ctx, meta) => {
        const cards = Array.isArray(payload.cards) ? payload.cards : [payload.cards];
        const toZoneId = payload.toZoneId;
        const state = ctx.getState();
        const toZone = state.coreState.zones[toZoneId];
        if (!toZone) {
            if (ctx.loadedConfig?.logConnections) {
                console.error(`${meta.roomId}: Zone ${toZoneId} does not exist`);
            }
            return { ...state };
        }
        return changeStateValue(state, `coreState.zones.${toZoneId}.cards`, [
            ...toZone.cards,
            ...cards,
        ]);
    },
};

export default addToZone;
