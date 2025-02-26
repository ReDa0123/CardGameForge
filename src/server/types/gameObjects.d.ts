import { Metadata, StateContext } from './gameState';

export type Zone<CustomZone extends Record<string, any>, CustomCard extends Record<string, any>> = {
    id: string;
    name: string;
    type?: string;
    owner?: string;
    cards: Card<CustomCard>[];
    custom?: CustomZone;
};

export type CardTemplate<CC extends Record<string, any>> = {
    id: string;
    name: string;
    displayType: string;
    moves?: {
        [moveName: string]: {
            canExecute?: (
                payload: any,
                ctx: StateContext<any, any, any, any>,
                cardId: string,
                meta: Metadata
            ) => boolean;
            execute?: (
                payload: any,
                ctx: StateContext<any, any, any, any>,
                cardId: string,
                meta: Metadata
            ) => void;
        };
    };
    actions?: {
        [actionType: string]: (
            payload: any,
            ctx: StateContext<any, any, any, any>,
            cardId: string,
            meta: Metadata
        ) => void;
    };
    custom?: CC;
};

export type Card<
    CustomCardTemplate extends Record<string, any>,
    DisplayProps extends Record<string, any> = Record<string, any>,
    CardState extends Record<string, any> = Record<string, any>
> = {
    id: string;
    templateId: string;
    templateFields: Pick<
        CardTemplate<CustomCardTemplate>,
        'name' | 'displayType' | 'moves' | 'actions' | 'custom'
    >;
    state?: CardState;
    displayProps?: DisplayProps;
};
