import { ActionTemplate } from '../../types/gameConfig';
import { actionTypes } from './actionTypes';
import { GameState } from '../../types/gameState';

export type ChangeZonePayload = {
    cardId: string;
    fromZoneId: string;
    toZoneId: string;
};

const changeZone: ActionTemplate<ChangeZonePayload> = {
    name: actionTypes.CHANGE_ZONE,
    apply: (payload, ctx, meta) => {
        const { cardId, fromZoneId, toZoneId } = payload;
        const state = ctx.getState();
        //Check if fromZone and toZone exist
        const fromZone = state.coreState.zones[fromZoneId];
        if (!fromZone) {
            if (ctx.loadedConfig?.logConnections) {
                console.error(`${meta.roomId}: Zone ${fromZoneId} does not exist`);
            }
            return { ...state };
        }
        const toZone = state.coreState.zones[toZoneId];
        if (!toZone) {
            if (ctx.loadedConfig?.logConnections) {
                console.error(`${meta.roomId}: Zone ${toZoneId} does not exist`);
            }
            return { ...state };
        }

        const card = state.coreState.zones[fromZoneId].cards.find((c) => c.id === cardId);
        // Check if card exists in fromZone
        if (!card) {
            if (ctx.loadedConfig?.logConnections) {
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
