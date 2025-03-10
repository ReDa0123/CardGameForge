import { ActionTemplate, Card } from '../../types/';
import { actionTypes } from './actionTypes';

export type ChangeCardPayload = {
    cardId: string;
    zoneId: string;
    cardChanges: Partial<Card<Record<string, any>>>;
};

/**
 * Action to change a card's properties.
 * Payload - The ID of the card to change, the zone it's in, and the changes to apply.
 */
const changeCard: ActionTemplate<ChangeCardPayload> = {
    name: actionTypes.CHANGE_CARD,
    apply: (payload, ctx, meta): ReturnType<typeof ctx.getState> => {
        const { cardId, cardChanges, zoneId } = payload;
        const state = ctx.getState();
        const zone = state.coreState.zones[zoneId];
        if (!zone) {
            if (ctx.loadedConfig?.logErrors) {
                console.error(`${meta.roomId}: Zone ${zoneId} does not exist`);
            }
            return { ...state };
        }
        const card = zone.cards.find((c) => c.id === cardId);
        if (!card) {
            if (ctx.loadedConfig?.logErrors) {
                console.error(`${meta.roomId}: Card ${cardId} does not exist in zone ${zoneId}`);
            }
            return { ...state };
        }

        return {
            ...state,
            coreState: {
                ...state.coreState,
                zones: {
                    ...state.coreState.zones,
                    [zoneId]: {
                        ...zone,
                        cards: zone.cards.map((c) =>
                            c.id === cardId ? { ...c, ...cardChanges } : c
                        ),
                    },
                },
            },
        };
    },
};

export default changeCard;
