import { setupAndRunServer, ServerOptions } from 'cardgameforge/server';
import { tichuGameConfig } from './config/gameConfig';
import { TichuState, TichuGameSettings, TichuCard } from './types';
const opts = {
    cors: {
        origin: ['http://localhost:3005'],
    },
} as ServerOptions;

setupAndRunServer<TichuState, TichuGameSettings, any, TichuCard>(3000, opts, tichuGameConfig);
