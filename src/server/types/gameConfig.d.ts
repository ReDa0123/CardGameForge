import {
    ActionDefinition,
    EndGameResult,
    GameState,
    MoveDefinition,
    StateContext,
} from './gameState';
import { CardTemplate } from './gameObjects';

export type PhaseDefinition = {
    name: string;
    next?: string;
};

export type EndGameCondition<
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = (ctx: StateContext<CS, CGO, CZ, CC>) => EndGameResult | null;

export type AfterGameEndFn<
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = (ctx: StateContext<CS, CGO, CZ, CC>, result: EndGameResult) => GameState<CS, CGO, CZ, CC>;

export type GameSetupFn<CS, CGO, CZ extends Record<string, any>, CC extends Record<string, any>> = (
    ctx: StateContext<CS, CGO, CZ, CC>
) => GameState<CS, CGO, CZ, CC>;

export type ConfigZone<CZ extends Record<string, any>> = {
    zoneId: string;
    zoneName: string;
    isPerPlayer?: boolean;
    custom?: CZ;
};

export type ActionTemplate<
    ActionPayload = unknown,
    CS = any,
    CGO = any,
    CZ extends Record<string, any> = Record<string, any>,
    CC extends Record<string, any> = Record<string, any>
> = Pick<ActionDefinition<ActionPayload, CS, CGO, CZ, CC>, 'name' | 'apply'>;

export type GameConfig<
    CustomState,
    CustomGameOptions,
    CustomZone extends Record<string, any>,
    CustomCard extends Record<string, any>
> = {
    name: string;
    minPlayers: number;
    maxPlayers: number;
    customState?: CustomState;
    moves: MoveDefinition<unknown, CustomState, CustomGameOptions, CustomZone, CustomCard>[];
    actions: ActionTemplate<unknown, CustomState, CustomGameOptions, CustomZone, CustomCard>[];
    randomSeed?: string | number;
    playOrder?: (
        ctx: StateContext<CustomState, CustomGameOptions, CustomZone, CustomCard>
    ) => string[];
    phases: {
        first: string;
        phasesList: PhaseDefinition[];
    };
    endGameCondition: EndGameCondition<CustomState, CustomGameOptions, CustomZone, CustomCard>;
    afterGameEnd: AfterGameEndFn<CustomState, CustomGameOptions, CustomZone, CustomCard>;
    defaultCustomGameOptions: CustomGameOptions;
    zones: ConfigZone<CustomZone>[];
    cardCollection: CardTemplate<CustomCard>[];
    gameSetup: GameSetupFn<CustomState, CustomGameOptions, CustomZone, CustomCard>;
    logConnections?: boolean;
};
