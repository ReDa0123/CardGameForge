import { setupAndRunServer } from 'cardgameforge/server';
import { tichuGameConfig } from './config/gameConfig';
import { TichuState, TichuGameSettings, TichuCard } from './types';

setupAndRunServer<TichuState, TichuGameSettings, any, TichuCard>(
    3000,
    {
        cors: {
            origin: ['http://localhost:5173', /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/],
        },
    },
    tichuGameConfig
);
