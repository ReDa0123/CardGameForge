import { EndGameResult, Teams, TurnOrder } from '../../shared/types/gameState';
import { CardTemplate, Zone } from './gameObjects';
import { DisplayRegistry } from './context';
import { Socket } from 'socket.io-client';

export type NetworkState = {
    playerId?: string;
    playerNickname?: string;
    roomId?: string;
    players?: {
        playerId: string;
        playerNickname: string;
    }[];
};

export type Selection = {
    [zoneId: string]: string[];
};

export type History = {
    recordType: string;
    actionName?: string;
    moveId?: string;
    payload?: any;
    originalPayload?: any;
    payloadHistory?: any[];
    meta: any;
    message?: string;
    cardReactions?: any[];
};

export type GameState<
    CustomState extends Record<string, any>,
    CustomGameOptions extends Record<string, any>,
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
            [zoneId: string]: Zone<CustomZone, CustomCard>;
        };
        history: History[];
        randomSeed?: string | number;
        selection: Selection;
    };
    customState: CustomState;
    gameOptions: CustomGameOptions;
    networkState: NetworkState | null;
};

export type GameContextType = {
    displayRegistry: DisplayRegistry;
    socket: Socket | null;
};

export type ReduxState<CS, CGO, CZ, CC> = {
    game: GameState<CS, CGO, CZ, CC>;
};
