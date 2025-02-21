import { createStateContext } from './createStateContext';
import { Metadata, MoveDefinition } from '../../types/gameState';
import { historyRecordsTypes } from '../../constants';
import { actionTypes } from '../actions';

export const executeMove = <
    Payload,
    CustomState,
    CustomGameOptions,
    CustomZone extends Record<string, any>,
    CustomCard extends Record<string, any>
>(
    move: MoveDefinition<Payload, CustomState, CustomGameOptions, CustomZone, CustomCard>,
    payload: Payload,
    meta: Metadata
) => {
    const roomId = meta.roomId;
    const context = createStateContext<CustomState, CustomGameOptions, CustomZone, CustomCard>(
        roomId
    );
    const currentPhase = context.getState().coreState.phase;
    let didExecute = false;
    const { canExecute, reason } = move?.canExecute?.(payload, context) ?? { canExecute: true };
    if (
        (move.allowedPhases === undefined || move.allowedPhases.includes(currentPhase)) &&
        canExecute
    ) {
        move.execute(payload, context, meta);
        didExecute = true;

        // Log the move
        context.dispatchAction(
            actionTypes.APPEND_HISTORY,
            {
                recordType: historyRecordsTypes.MOVE,
                moveId: move.name,
                payload,
                meta,
                message: move.message(payload, context, meta),
            },
            meta
        );

        if (move.changeTurnAfter) {
            context.dispatchAction(actionTypes.END_TURN, {}, meta);
        }
    }

    return { didExecute, newState: context.getState(), reason };
};
