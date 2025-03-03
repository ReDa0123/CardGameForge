import { ActionTemplate } from '../../types';
import { actionTypes } from './actionTypes';
import { assocByDotPath } from './utils';
import { Teams } from '../../../shared/types/gameState';

export type SetTeamsPayload = Teams;

/**
 * Action to set the teams in the game.
 * Payload - The teams object.
 */
const setTeams: ActionTemplate<SetTeamsPayload> = {
    name: actionTypes.SET_TEAMS,
    apply: (payload, ctx) => {
        return assocByDotPath(ctx.getState(), 'coreState.teams', payload);
    },
};

export default setTeams;
