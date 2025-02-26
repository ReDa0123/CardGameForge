import { GameState, HistoryRecord, Metadata, NetworkState, Card, Zone } from '../../types';

export const getInitialGameState = (
    customValues: Partial<
        GameState<
            Record<string, any>,
            Record<string, any>,
            Record<string, any>,
            Record<string, any>
        >['coreState']
    > = {}
): GameState<
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>
> => {
    return {
        customState: {},
        gameOptions: {},
        networkState: {
            roomId: 'roomId',
            players: [] as { playerId: string; playerNickname: string }[],
        } as NetworkState,
        coreState: {
            gameInProgress: true,
            endResult: null,
            phase: 'phase',
            turnOrder: {
                activePlayer: '1',
                nextPlayer: '2',
                playOrder: ['1', '2'],
                activePlayerIndex: 0,
            },
            teams: null,
            cardCollection: [],
            zones: {} as {
                [zoneId: string]: Zone<Record<string, any>, Record<string, any>>;
            },
            history: [] as HistoryRecord<unknown>[],
            ...customValues,
        },
    };
};

export const getMeta = (): Metadata => ({
    roomId: 'roomId',
    timestamp: new Date(),
});

export const getCard = (id: string): Card<Record<string, any>> => ({
    id,
    templateId: id,
    templateFields: {
        name: id,
        displayType: 'card',
    },
});
