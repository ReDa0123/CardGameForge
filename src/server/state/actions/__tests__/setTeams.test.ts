import setTeams from '../setTeams';
import { getInitialGameState, getMeta } from '../testUtils';
import { StateContext, Teams } from '../../../types/gameState';

describe('setTeams action', () => {
    it('should set the teams when teams are null', () => {
        const initialState = getInitialGameState();
        const ctxMock: Partial<
            StateContext<unknown, unknown, Record<string, any>, Record<string, any>>
        > = {
            getState: jest.fn(() => initialState),
        };
        const newTeams: Teams = {
            team1: ['1', '2'],
            team2: ['3', '4'],
        };

        const result = setTeams.apply(
            newTeams,
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        const expectedState = getInitialGameState({
            teams: newTeams,
        });
        expect(result.coreState.teams).toEqual(newTeams);
        expect(result).toEqual(expectedState);
    });
    it('should set the teams when teams are already set', () => {
        const initialState = getInitialGameState({
            teams: {
                team1: ['1', '2'],
                team2: ['3', '4'],
            },
        });
        const ctxMock: Partial<
            StateContext<unknown, unknown, Record<string, any>, Record<string, any>>
        > = {
            getState: jest.fn(() => initialState),
        };
        const newTeams: Teams = {
            team1: ['3', '4'],
            team2: ['1', '2'],
        };

        const result = setTeams.apply(
            newTeams,
            ctxMock as StateContext<unknown, unknown, Record<string, any>, Record<string, any>>,
            getMeta()
        );
        const expectedState = getInitialGameState({
            teams: newTeams,
        });
        expect(result.coreState.teams).toEqual(newTeams);
        expect(result).toEqual(expectedState);
    });
});
