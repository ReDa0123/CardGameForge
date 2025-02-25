import { ActionTemplate } from '../../types';
import { actionTypes } from './actionTypes';
import { assocByDotPath } from './utils';

export type ChangePhasePayload = {
    phase: string;
};

/**
 * Action to change the current phase of the game.
 * If the payload is empty string, the phase will be determined from the game config from the prop next.
 * Payload - The new phase to set.
 */
const changePhase: ActionTemplate<ChangePhasePayload> = {
    name: actionTypes.CHANGE_PHASE,
    apply: (payload, ctx) => {
        const state = ctx.getState();
        const loadedConfig = ctx.loadedConfig;
        const nextPhase =
            payload.phase === ''
                ? loadedConfig.phases.phasesList.find((p) => p.name === state.coreState.phase)?.next
                : payload.phase;

        if (!nextPhase) {
            if (loadedConfig.logErrors) {
                console.error(`No next phase found for phase ${state.coreState.phase}`);
            }
            return { ...state };
        }

        if (!ctx.loadedConfig.phases.phasesList.find((p) => p.name === nextPhase)) {
            if (loadedConfig.logErrors) {
                console.error(`Phase ${nextPhase} does not exist in game config`);
            }
            return { ...state };
        }

        return assocByDotPath(state, 'coreState.phase', nextPhase);
    },
};

export default changePhase;
