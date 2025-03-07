import { GAME_PHASES } from '../constants';
import { PhaseDefinition } from 'cardgameforge/server';

export const phases: {
    first: string;
    phasesList: PhaseDefinition[];
} = {
    first: GAME_PHASES.BIG_TICHU,
    phasesList: [
        {
            name: GAME_PHASES.BIG_TICHU,
            next: GAME_PHASES.SMALL_TICHU,
        },
        {
            name: GAME_PHASES.SMALL_TICHU,
            next: GAME_PHASES.SEND_CARDS,
        },
        {
            name: GAME_PHASES.SEND_CARDS,
            next: GAME_PHASES.PLAY_CARDS,
        },
        {
            name: GAME_PHASES.PLAY_CARDS,
        },
        {
            name: GAME_PHASES.SEND_DECK,
        },
        {
            name: GAME_PHASES.TURN_END,
            next: GAME_PHASES.BIG_TICHU,
        },
    ],
};
