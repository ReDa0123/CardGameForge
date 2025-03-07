import { ActionTemplate, GameState } from '../../types';
import { actionTypes } from './actionTypes';

export type MoveCardsFromZonePayload = {
    fromZoneId: string;
    toZoneId: string;
    numberOfCards?: number;
};

/**
 * Action to move all cards from one zone to another if numberOfCards is not provided.
 * If numberOfCards is provided, move the specified number of first cards from the source zone to the destination zone.
 * Payload - The ID of the source zone and the ID of the destination zone.
 */
const moveCardsFromZone: ActionTemplate<MoveCardsFromZonePayload> = {
    name: actionTypes.MOVE_CARDS_FROM_ZONE,
    apply: (payload, ctx, meta) => {
        const { fromZoneId, toZoneId, numberOfCards } = payload;
        const state = ctx.getState();

        // Check if fromZone and toZone exist
        const fromZone = state.coreState.zones[fromZoneId];
        if (!fromZone) {
            if (ctx.loadedConfig?.logErrors) {
                console.error(`${meta.roomId}: Zone ${fromZoneId} does not exist`);
            }
            return { ...state };
        }
        // Check if toZone exists
        const toZone = state.coreState.zones[toZoneId];
        if (!toZone) {
            if (ctx.loadedConfig?.logErrors) {
                console.error(`${meta.roomId}: Zone ${toZoneId} does not exist`);
            }
            return { ...state };
        }

        // Move all cards from fromZone to toZone
        const newState: GameState<any, any, Record<string, any>, Record<string, any>> = {
            ...state,
            coreState: {
                ...state.coreState,
                zones: {
                    ...state.coreState.zones,
                    [fromZoneId]: {
                        ...fromZone,
                        cards: numberOfCards ? fromZone.cards.slice(numberOfCards) : [],
                    },
                    [toZoneId]: {
                        ...toZone,
                        cards: [
                            ...toZone.cards,
                            ...(numberOfCards
                                ? fromZone.cards.slice(0, numberOfCards)
                                : fromZone.cards),
                        ],
                    },
                },
            },
        };
        return newState;
    },
};

export default moveCardsFromZone;
