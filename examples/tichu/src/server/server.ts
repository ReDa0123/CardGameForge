import { setupAndRunServer } from 'cardgameforge/server';
import { tichuGameConfig } from './config/gameConfig';
import { TichuState, TichuGameSettings, TichuCard } from './types';

setupAndRunServer<TichuState, TichuGameSettings, any, TichuCard>(3000, {}, tichuGameConfig);
