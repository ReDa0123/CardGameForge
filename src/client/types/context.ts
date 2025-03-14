import React from 'react';
import { Theme } from '@mui/material';
import { Card, Zone } from './gameObjects';

export type SelectCardPayload = {
    cardId: string;
    zoneId: string;
};

export type CardComponent<
    CustomCard extends Record<string, any> = any,
    CustomZone extends Record<string, any> = any
> = React.ComponentType<{
    card: Card<CustomCard>;
    zone: Zone<CustomZone, CustomCard>;
}>;

export type DisplayRegistry = {
    default: CardComponent;
    displayTypes?: {
        [displayType: string]: {
            default: CardComponent;
            zones?: {
                [zoneId: string]: CardComponent;
            };
        };
    };
};

export type GameContextProviderProps = {
    children: React.ReactNode;
    serverAddress: string;
    displayRegistry: DisplayRegistry;
    materialTheme?: Theme;
};
