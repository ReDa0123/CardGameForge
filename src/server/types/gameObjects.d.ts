import { GameState, StateContext } from './gameState';

export type Zone<CustomZone extends Record<string, any>> = {
    id: string;
    name: string;
    type?: string;
    owner?: string;
    cards: Card<any>[]; // TODO: any?
    custom?: CustomZone;
};

export type CardTemplate<CC extends Record<string, any>> = {
    id: string;
    name: string;
    displayType: string;
    moves?: {
        [moveName: string]: {
            canExecute?: <CS, CGO, CZ extends Record<string, any>, CC extends Record<string, any>>(
                payload: unknown,
                ctx: StateContext<CS, CGO, CZ, CC>,
                cardId: string
            ) => boolean;
            execute?: <CS, CGO, CZ extends Record<string, any>, CC extends Record<string, any>>(
                payload: unknown,
                ctx: StateContext<CS, CGO, CZ, CC>,
                cardId: string
            ) => GameState<CS, CGO, CZ, CC>;
        };
    };
    actions?: {
        [actionType: string]: <
            Payload,
            CS,
            CGO,
            CZ extends Record<string, any>,
            CC extends Record<string, any>
        >(
            payload: Payload,
            ctx: StateContext<CS, CGO, CZ, CC>,
            cardId: string
        ) => GameState<CS, CGO, CZ, CC>;
    };
    custom?: CC;
};

export type Card<CC extends Record<string, any>> = {
    id: string;
    templateId: string;
    templateFields: Pick<CardTemplate<CC>, 'name' | 'displayType' | 'moves' | 'actions' | 'custom'>;
    state?: Record<string, any>;
    displayProps?: Record<string, any>;
};
