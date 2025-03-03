export type Zone<CustomZone extends Record<string, any>, CustomCard extends Record<string, any>> = {
    id: string;
    name: string;
    type?: string;
    owner?: string;
    cards: Card<CustomCard>[];
    custom?: CustomZone;
};

export type CardTemplate<CustomCard extends Record<string, any>> = {
    id: string;
    name: string;
    displayType: string;
    custom?: CustomCard;
};

export type Card<
    CustomCardTemplate extends Record<string, any>,
    DisplayProps extends Record<string, any> = Record<string, any>,
    CardState extends Record<string, any> = Record<string, any>
> = {
    id: string;
    templateId: string;
    templateFields: Pick<CardTemplate<CustomCardTemplate>, 'name' | 'displayType' | 'custom'>;
    state?: CardState;
    displayProps?: DisplayProps;
};
