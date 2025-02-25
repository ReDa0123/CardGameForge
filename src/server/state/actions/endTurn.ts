import { ActionTemplate } from '../../types';
import { actionTypes } from './actionTypes';

export type EndTurnPayload = object;

/**
 * Action to end the current player's turn.
 */
const endTurn: ActionTemplate<EndTurnPayload> = {
    name: actionTypes.END_TURN,
    apply: (payload, ctx) => {
        const state = ctx.getState();
        const { nextPlayer, playOrder, activePlayerIndex } = state.coreState.turnOrder;
        const newActivePlayerIndex =
            activePlayerIndex + 2 > playOrder.length ? 0 : activePlayerIndex + 1;
        return {
            ...state,
            coreState: {
                ...state.coreState,
                turnOrder: {
                    activePlayer: nextPlayer,
                    nextPlayer:
                        playOrder[
                            newActivePlayerIndex + 2 > playOrder.length
                                ? 0
                                : newActivePlayerIndex + 1
                        ],
                    activePlayerIndex: newActivePlayerIndex,
                    playOrder,
                },
            },
        };
    },
};

export default endTurn;
