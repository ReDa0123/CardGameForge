import { ActionTemplate, GameState } from '../../types';
import { actionTypes } from './actionTypes';

export type ChangeZonePayload = {
    cardIds: string | string[];
    fromZoneId: string;
    toZoneId: string;
};

/**
 * Action to change cards' zones.
 * Can pass multiple card IDs to change multiple cards' zones at once.
 * Payload - The IDs of the cards to change, the ID of the zone they're in, and the ID of the zone to move them to.
 */
const changeZone: ActionTemplate<ChangeZonePayload> = {
    name: actionTypes.CHANGE_ZONE,
    apply: (payload, ctx, meta) => {
        const cardIds = Array.isArray(payload.cardIds) ? payload.cardIds : [payload.cardIds];
        const { fromZoneId, toZoneId } = payload;
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

        // Find all cards that exist in fromZone
        const cardsToMove = fromZone.cards.filter((c) => cardIds.includes(c.id));
        const missingCardIds = cardIds.filter((id) => !fromZone.cards.some((c) => c.id === id));

        // Check if all cards exist in fromZone
        if (missingCardIds.length > 0) {
            if (ctx.loadedConfig?.logErrors) {
                console.error(
                    `${meta.roomId}: Cards ${missingCardIds.join(
                        ', '
                    )} do not exist in zone ${fromZoneId}`
                );
            }
            return { ...state };
        }

        // Change the cards' zone
        const newState: GameState<any, any, Record<string, any>, Record<string, any>> = {
            ...state,
            coreState: {
                ...state.coreState,
                zones: {
                    ...state.coreState.zones,
                    [fromZoneId]: {
                        ...fromZone,
                        cards: fromZone.cards.filter((c) => !cardIds.includes(c.id)),
                    },
                    [toZoneId]: {
                        ...toZone,
                        cards: [...toZone.cards, ...cardsToMove],
                    },
                },
            },
        };
        return newState;
    },
};

export default changeZone;
