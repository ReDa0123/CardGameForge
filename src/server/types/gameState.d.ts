import { Card, CardTemplate, Zone } from './gameObjects';
import { ActionRegistry, MovesRegistry } from './registries';
import { GameConfig } from './gameConfig';
import { historyRecordsTypes } from '../constants';

export type NetworkState = {
    //playerId?: string; Only on client
    //playerNickname?: string; Only on client
    //initialized: boolean; Only on client
    roomId: string;
    players: {
        playerId: string;
        playerNickname: string;
    }[];
} | null;

export type TurnOrder = {
    activePlayer: string;
    nextPlayer: string;
    playOrder: string[];
    activePlayerIndex: number;
};

export type Teams = { [teamId: string]: string[] };

export type GameState<
    CustomState,
    CustomGameOptions,
    CustomZone extends Record<string, any>,
    CustomCard extends Record<string, any>
> = {
    coreState: {
        gameInProgress: boolean;
        endResult: EndGameResult | null;
        phase: string;
        turnOrder: TurnOrder;
        teams: Teams | null;
        cardCollection: CardTemplate<CustomCard>[];
        zones: {
            [zoneId: string]: Zone<CustomZone>;
        };
        history: HistoryRecord<unknown>[];
        randomSeed?: string | number;
    };
    customState: CustomState;
    gameOptions: CustomGameOptions;
    networkState: NetworkState;
};

export type Metadata = {
    playerId?: string;
    playerNickname?: string;
    timestamp: Date;
    moveId?: string;
    roomId: string;
    actionId?: string;
    hookId?: string;
};

export type RecordType = typeof historyRecordsTypes[keyof typeof historyRecordsTypes];

export type PayloadHistoryRecord<Payload> = {
    payload: Payload;
    isInitial?: boolean;
    actionId?: string;
    hookId?: string;
};

export type HistoryRecord<Payload> = {
    recordType: RecordType;
    actionName?: string;
    moveId?: string;
    payload?: Payload;
    originalPayload?: ExtendedPayload<Payload>;
    payloadHistory?: PayloadHistoryRecord<Payload>[];
    meta: Metadata;
    message?: string;
    cardReactions?: string[];
};

export type ExtendedPayload<ActionPayload> = ActionPayload & {
    ABORT?: boolean;
};

export type DispatchAction<
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = <ActionPayload>(
    actionName: string,
    payload: ActionPayload,
    meta: Metadata
) => GameState<CS, CGO, CZ, CC>;

export type HookApply = <
    ActionPayload,
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
>(
    payload: ExtendedPayload<ActionPayload>,
    ctx: StateContext<CS, CGO, CZ, CC>,
    meta: Metadata
) => Partial<ExtendedPayload<ActionPayload>>;

export type ActionHook<
    ActionPayload,
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = {
    id: string;
    actionName: string;
    hookApply: HookApply;
    once: boolean;
    removeCond?: (
        payload: ExtendedPayload<ActionPayload>,
        ctx: StateContext<CS, CGO, CZ, CC>,
        meta: Metadata
    ) => boolean;
};

export type AddHookOptions<
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = {
    once?: boolean;
    removeCond?: <ActionPayload>(
        payload: ActionPayload,
        ctx: StateContext<CS, CGO, CZ, CC>,
        meta: Metadata
    ) => boolean;
};

export type AddHookFn<CS, CGO, CZ extends Record<string, any>, CC extends Record<string, any>> = (
    actionName: string,
    hookId: string,
    hookApply: HookApply,
    options?: AddHookOptions<CS, CGO, CZ, CC>
) => void;

export type RemoveHookFn = (hookId: string, actionName: string) => void;

export type StateContext<
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = {
    getState: () => GameState<CS, CGO, CZ, CC>;
    dispatchAction: DispatchAction<CS, CGO, CZ, CC>;
    randomize: <T>(array: T[]) => T[];
    getActionRegistry: () => ActionRegistry<CS, CGO, CZ, CC>;
    getMovesRegistry: () => MovesRegistry<CS, CGO, CZ, CC>;
    addBeforeHook: AddHookFn<CS, CGO, CZ, CC>;
    addAfterHook: AddHookFn<CS, CGO, CZ, CC>;
    removeBeforeHook: RemoveHookFn;
    removeAfterHook: RemoveHookFn;
    exportHistory: (path: string, filename?: string) => void;
    loadedConfig: GameConfig<CS, CGO, CZ, CC>;
    createCardFromTemplate: (
        cardTemplate: CardTemplate<CC>,
        displayProps?: Record<string, any>,
        initialState?: Record<string, any>
    ) => Card<CC>;
};

export type ActionApply<
    ActionPayload,
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = (
    payload: ActionPayload,
    ctx: StateContext<CS, CGO, CZ, CC>,
    meta: Metadata
) => GameState<CS, CGO, CZ, CC>;

export type ActionDefinition<
    ActionPayload,
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = {
    name: string;
    apply: ActionApply<ActionPayload, CS, CGO, CZ, CC>;
    beforeHooks: Array<ActionHook<ActionPayload, CS, CGO, CZ, CC>>;
    afterHooks: Array<ActionHook<ActionPayload, CS, CGO, CZ, CC>>;
};

export type MoveDefinition<
    Payload,
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = {
    name: string;
    allowedPhases?: string[];
    canExecute?: (
        payload: Payload,
        ctx: StateContext<CS, CGO, CZ, CC>
    ) => { canExecute: boolean; reason?: string };
    execute: (payload: Payload, ctx: StateContext<CS, CGO, CZ, CC>, meta: Metadata) => void;
    message: (payload: Payload, ctx: StateContext<CS, CGO, CZ, CC>, meta: Metadata) => string;
    changeTurnAfter?: boolean;
};

export type EndGameResult = {
    winner?: string;
    isTie: boolean;
    reason?: string;
};
