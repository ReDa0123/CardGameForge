import { ActionTemplate } from '../../types/gameConfig';
import { actionTypes } from './actionTypes';

const endTurn: ActionTemplate<object> = {
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
