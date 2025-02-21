import { ActionTemplate } from '../../types/gameConfig';
import { Teams } from '../../types/gameState';
import { actionTypes } from './actionTypes';
import { changeStateValue } from './utils';

const setTeams: ActionTemplate<Teams> = {
    name: actionTypes.SET_TEAMS,
    apply: (payload, ctx) => {
        return changeStateValue(ctx.getState(), 'coreState.teams', payload);
    },
};

export default setTeams;
