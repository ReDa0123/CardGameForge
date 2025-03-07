import { ActionDefinition, GameState, Metadata, MoveDefinition, StateContext } from './gameState';
import { CardTemplate } from './gameObjects';
import { EndGameResult } from '../../shared';

export type PhaseDefinition = {
    name: string;
    next?: string;
};

export type EndGameCondition<
    CS extends Record<string, any>,
    CGO extends Record<string, any>,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = (ctx: StateContext<CS, CGO, CZ, CC>) => EndGameResult | null;

export type AfterGameEndFn<
    CS extends Record<string, any>,
    CGO extends Record<string, any>,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = (
    ctx: StateContext<CS, CGO, CZ, CC>,
    result: EndGameResult,
    meta: Metadata
) => GameState<CS, CGO, CZ, CC>;

export type GameSetupFn<
    CS extends Record<string, any>,
    CGO extends Record<string, any>,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = (ctx: StateContext<CS, CGO, CZ, CC>, meta: Metadata) => GameState<CS, CGO, CZ, CC>;

export type ConfigZone<CZ extends Record<string, any>> = {
    zoneId: string;
    zoneName: string;
    isPerPlayer?: boolean;
    custom?: CZ;
};

export type ActionTemplate<
    ActionPayload = unknown,
    CS extends Record<string, any> = any,
    CGO extends Record<string, any> = any,
    CZ extends Record<string, any> = Record<string, any>,
    CC extends Record<string, any> = Record<string, any>
> = Pick<ActionDefinition<ActionPayload, CS, CGO, CZ, CC>, 'name' | 'apply'>;

export type GameConfig<
    CustomState extends Record<string, any>,
    CustomGameOptions extends Record<string, any>,
    CustomZone extends Record<string, any>,
    CustomCard extends Record<string, any>
> = {
    name: string;
    minPlayers: number;
    maxPlayers: number;
    customState?: CustomState;
    moves: MoveDefinition<any, CustomState, CustomGameOptions, CustomZone, CustomCard>[];
    actions: ActionTemplate<any, CustomState, CustomGameOptions, CustomZone, CustomCard>[];
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
    logErrors?: boolean;
};
