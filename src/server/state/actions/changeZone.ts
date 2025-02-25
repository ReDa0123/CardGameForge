import { ActionTemplate, GameState } from '../../types';
import { actionTypes } from './actionTypes';

export type ChangeZonePayload = {
    cardId: string;
    fromZoneId: string;
    toZoneId: string;
};

/**
 * Action to change a card's zone.
 * Payload - The ID of the card to change, the ID of the zone it's in, and the ID of the zone to move it to.
 */
const changeZone: ActionTemplate<ChangeZonePayload> = {
    name: actionTypes.CHANGE_ZONE,
    apply: (payload, ctx, meta) => {
        const { cardId, fromZoneId, toZoneId } = payload;
        const state = ctx.getState();
        //Check if fromZone and toZone exist
        const fromZone = state.coreState.zones[fromZoneId];
        if (!fromZone) {
            if (ctx.loadedConfig?.logErrors) {
                console.error(`${meta.roomId}: Zone ${fromZoneId} does not exist`);
            }
            return { ...state };
        }
        const toZone = state.coreState.zones[toZoneId];
        if (!toZone) {
            if (ctx.loadedConfig?.logErrors) {
                console.error(`${meta.roomId}: Zone ${toZoneId} does not exist`);
            }
            return { ...state };
        }

        const card = state.coreState.zones[fromZoneId].cards.find((c) => c.id === cardId);
        // Check if card exists in fromZone
        if (!card) {
            if (ctx.loadedConfig?.logErrors) {
                console.error(
                    `${meta.roomId}: Card ${cardId} does not exist in zone ${fromZoneId}`
                );
            }
            return { ...state };
        }

        // Change the card's zone
        const newState: GameState<any, any, Record<string, any>, Record<string, any>> = {
            ...state,
            coreState: {
                ...state.coreState,
                zones: {
                    ...state.coreState.zones,
                    [fromZoneId]: {
                        ...fromZone,
                        cards: fromZone.cards.filter((c) => c.id !== cardId),
                    },
                    [toZoneId]: {
                        ...toZone,
                        cards: [...toZone.cards, card],
                    },
                },
            },
        };
        return newState;
    },
};

export default changeZone;
