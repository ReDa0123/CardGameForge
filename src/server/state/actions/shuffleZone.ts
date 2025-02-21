import { ActionTemplate } from '../../types/gameConfig';
import { actionTypes } from './actionTypes';
import { changeStateValue } from './utils';

const shuffleZone: ActionTemplate<string> = {
    name: actionTypes.SHUFFLE_ZONE,
    apply: (payload, ctx, meta) => {
        const state = ctx.getState();
        const zone = state.coreState.zones[payload];
        if (!zone) {
            if (ctx.loadedConfig?.logConnections) {
                console.error(`${meta.roomId}: Zone ${payload} does not exist`);
            }
            return { ...state };
        }
        const shuffledCards = ctx.randomize(zone.cards);
        return changeStateValue(state, `coreState.zones.${payload}.cards`, shuffledCards);
    },
};

export default shuffleZone;
