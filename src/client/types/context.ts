import React from 'react';
import { Theme } from '@mui/material';

export type SelectCardPayload = {
    cardId: string;
    zoneId: string;
};

export type DisplayRegistry = {
    default: React.ComponentType<any>;
    displayTypes?: {
        [displayType: string]: {
            default: React.ComponentType<any>;
            zones?: {
                [zoneId: string]: React.ComponentType<any>;
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
