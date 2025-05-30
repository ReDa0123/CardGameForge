import { EVERYBODY } from '../../../shared';
import { ActionTemplate } from '../../types';
import { actionTypes } from './actionTypes';

export type SetActivePlayerPayload = {
    playerId: string | 'EVERYBODY';
    force?: boolean;
};

/**
 * Action to set a new active player
 * Payload - An object with the ID of the new active player and an optional flag to force the change
 * even if the player is not in the play order
 */
const setActivePlayer: ActionTemplate<SetActivePlayerPayload> = {
    name: actionTypes.SET_ACTIVE_PLAYER,
    apply: (payload, ctx, meta) => {
        const newPlayerId = payload.playerId;
        const state = ctx.getState();
        if (newPlayerId === EVERYBODY) {
            return {
                ...state,
                coreState: {
                    ...state.coreState,
                    turnOrder: {
                        ...state.coreState.turnOrder,
                        activePlayer: EVERYBODY,
                    },
                },
            };
        }
        if (payload.force) {
            return {
                ...state,
                coreState: {
                    ...state.coreState,
                    turnOrder: {
                        ...state.coreState.turnOrder,
                        activePlayer: newPlayerId,
                    },
                },
            };
        }
        const { playOrder } = state.coreState.turnOrder;
        const activePlayerIndex = playOrder.indexOf(newPlayerId);
        if (activePlayerIndex === -1) {
            if (ctx.loadedConfig?.logErrors) {
                console.error(`${meta.roomId}: Player ${newPlayerId} not found in play order`);
            }
            return ctx.getState();
        }
        return {
            ...state,
            coreState: {
                ...state.coreState,
                turnOrder: {
                    ...state.coreState.turnOrder,
                    activePlayer: newPlayerId,
                    activePlayerIndex,
                    nextPlayer:
                        playOrder[
                            activePlayerIndex + 2 > playOrder.length ? 0 : activePlayerIndex + 1
                        ],
                },
            },
        };
    },
};

export default setActivePlayer;
