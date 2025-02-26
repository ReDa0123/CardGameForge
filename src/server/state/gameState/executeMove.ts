import { createStateContext } from './createStateContext';
import { Metadata, MoveDefinition } from '../../types';
import { historyRecordsTypes } from '../../constants';
import { actionTypes, AppendHistoryPayload, EndTurnPayload } from '../actions';

/**
 * Execute a move in the game state.
 * @param move The move to execute
 * @param payload The payload for the move
 * @param meta Metadata for the move
 */
export const executeMove = <
    Payload,
    CustomState extends Record<string, any>,
    CustomGameOptions extends Record<string, any>,
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
    const { canExecute, reason } = move?.canExecute?.(payload, context, meta) ?? {
        canExecute: true,
    };
    let finalReason = reason;
    if (move.allowedPhases !== undefined && !move.allowedPhases.includes(currentPhase)) {
        finalReason = `Move ${move.name} not allowed in phase ${currentPhase}`;
    } else if (canExecute) {
        // Log the move
        context.dispatchAction<AppendHistoryPayload>(
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

        // Execute the move
        move.execute(payload, context, meta);
        didExecute = true;

        if (move.changeTurnAfter && context.getState().coreState.gameInProgress) {
            context.dispatchAction<EndTurnPayload>(actionTypes.END_TURN, {}, meta);
        }
    }

    return { didExecute, newState: context.getState(), reason: finalReason };
};
