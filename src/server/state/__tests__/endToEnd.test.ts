import {
    executeMove,
    getRoomGameData,
    prepareGameState,
    removeRoomGameData,
    setLoadedConfig,
} from '../gameState';
import {
    ActionTemplate,
    CardTemplate,
    ConfigZone,
    GameConfig,
    HistoryRecord,
    MoveDefinition,
    NetworkState,
} from '../../types';
import { actionTypes, allLibActions } from '../actions';
import { expect } from '@jest/globals';
import { AddToZonePayload, ChangePhasePayload } from '../actions';
import { historyRecordsTypes } from '../../constants';
import { EndGameResult } from '../../../shared';

// Test data setup
const roomId = 'testRoom';
let callCounter = 0;
let endGameMessage: string | undefined;
const MESSAGE = 'Test reason';

const testMove: MoveDefinition<any, any, any, Record<string, any>, Record<string, any>> = {
    name: 'testChangePhase',
    canExecute: () => {
        return { canExecute: true };
    },
    execute: (_, ctx, meta) => {
        callCounter++;
        return ctx.dispatchAction<ChangePhasePayload>(
            actionTypes.CHANGE_PHASE,
            { phase: '' },
            meta
        );
    },
    message: () => 'Changing phase',
    changeTurnAfter: true,
};

const testZone1: ConfigZone<any> = {
    zoneId: 'testZone',
    zoneName: 'Test Zone',
};

const testZone2: ConfigZone<any> = {
    zoneId: 'testZone2',
    zoneName: 'Test Zone 2',
    isPerPlayer: true,
};

const cardCollection: CardTemplate<Record<string, any>>[] = [
    {
        id: 'testCard',
        name: 'Test Card',
        displayType: 'card',
    },
];

const playOrder = ['2', '1'];

const mockGameConfig: GameConfig<any, any, Record<string, any>, Record<string, any>> = {
    name: 'TestGame',
    minPlayers: 2,
    maxPlayers: 4,
    moves: [testMove],
    actions: [] as ActionTemplate<any>[],
    randomSeed: 42,
    phases: {
        first: 'phase1',
        phasesList: [
            { name: 'phase1', next: 'phase2' },
            { name: 'phase2', next: 'phase1' },
        ],
    },
    endGameCondition: (): EndGameResult | null => {
        if (callCounter >= 2) {
            return { winner: '1', isTie: false, reason: MESSAGE };
        }
        return null;
    },
    playOrder: () => playOrder,
    afterGameEnd: (ctx, result) => {
        endGameMessage = result.reason;
        return ctx.getState();
    },
    defaultCustomGameOptions: {} as Record<string, any>,
    zones: [testZone1, testZone2],
    cardCollection,
    gameSetup: (ctx, meta) => {
        for (const cardTemplate of ctx.getState().coreState.cardCollection) {
            const cardInstance = ctx.createCardFromTemplate(cardTemplate);
            ctx.dispatchAction<AddToZonePayload>(
                actionTypes.ADD_TO_ZONE,
                { cards: cardInstance, toZoneId: testZone1.zoneId },
                meta
            );
        }
        return ctx.getState();
    },
    logErrors: true,
};

const mockNetworkState: NetworkState = {
    roomId,
    players: [
        { playerId: '1', playerNickname: 'Player 1' },
        { playerId: '2', playerNickname: 'Player 2' },
    ],
};

type ReducedHistoryRecord = {
    recordType: string;
    actionName?: string;
    moveId?: string;
    message?: string;
    playerId?: string;
};

const reduceHistory = ({
    recordType,
    actionName,
    moveId,
    message,
    meta,
}: HistoryRecord<unknown>): ReducedHistoryRecord => ({
    recordType,
    actionName,
    moveId,
    message,
    playerId: meta.playerId,
});

const firstHistoryCheckArray = [
    {
        recordType: historyRecordsTypes.ACTION,
        actionName: actionTypes.SET_TURN_ORDER,
    },
    {
        recordType: historyRecordsTypes.ACTION,
        actionName: actionTypes.ADD_TO_ZONE,
    },
    {
        recordType: historyRecordsTypes.MOVE,
        moveId: testMove.name,
        message: 'Changing phase',
        playerId: playOrder[0],
    },
    {
        recordType: historyRecordsTypes.ACTION,
        actionName: actionTypes.CHANGE_PHASE,
        playerId: playOrder[0],
    },
    {
        recordType: historyRecordsTypes.ACTION,
        actionName: actionTypes.END_TURN,
        playerId: playOrder[0],
    },
];

const secondHistoryCheckArray = [
    ...firstHistoryCheckArray,
    {
        recordType: historyRecordsTypes.MOVE,
        moveId: testMove.name,
        message: 'Changing phase',
        playerId: playOrder[1],
    },
    {
        recordType: historyRecordsTypes.ACTION,
        actionName: actionTypes.CHANGE_PHASE,
        playerId: playOrder[1],
    },
    {
        recordType: historyRecordsTypes.SYSTEM,
        message: 'Game ended',
        actionName: actionTypes.END_GAME,
        playerId: playOrder[1],
    },
];

describe('End-to-end test', () => {
    it('should run through a successful full game loop', () => {
        // Setup
        setLoadedConfig<any, any, Record<string, any>, Record<string, any>>(mockGameConfig);
        prepareGameState<any, any, Record<string, any>, Record<string, any>>(
            roomId,
            mockGameConfig,
            mockNetworkState
        );
        // Check game data, move registration and library action registration
        const roomGameData = getRoomGameData(roomId);
        expect(roomGameData).toBeDefined();
        if (!roomGameData) {
            return;
        }
        expect(roomGameData.movesRegistry.getMove('testChangePhase')).toEqual(testMove);
        expect(Object.keys(roomGameData.actionRegistry.actions)).toHaveLength(allLibActions.length);

        // Check single zone and perPlayer zone creation
        const zones = roomGameData.gameState.coreState.zones;
        const singleZone = zones['testZone'];
        const perPlayerZone1 = zones['testZone2_1'];
        const perPlayerZone2 = zones['testZone2_2'];
        expect(singleZone).toBeDefined();
        expect(perPlayerZone1).toBeDefined();
        expect(perPlayerZone2).toBeDefined();
        // Check gameSetup here as well
        expect(singleZone).toEqual({
            id: testZone1.zoneId,
            name: testZone1.zoneName,
            cards: [
                {
                    id: 'testCard_0',
                    templateId: 'testCard',
                    templateFields: {
                        name: 'Test Card',
                        displayType: 'card',
                    },
                },
            ],
        });
        expect(perPlayerZone1).toEqual({
            id: 'testZone2_1',
            name: testZone2.zoneName,
            cards: [],
            type: testZone2.zoneId,
            owner: '1',
        });

        // Check turnOrder
        expect(roomGameData.gameState.coreState.turnOrder).toEqual({
            activePlayer: '2',
            nextPlayer: '1',
            playOrder,
            activePlayerIndex: 0,
        });

        // Run game loop
        const move = roomGameData.movesRegistry.getMove(testMove.name);
        expect(move).toBeDefined();
        if (!move) {
            return;
        }
        const baseMeta = { roomId, timestamp: new Date() };
        const getTurnMeta = (playerIndex: number) => ({
            ...baseMeta,
            playerId: mockNetworkState.players[playerIndex].playerId,
            playerNickname: mockNetworkState.players[playerIndex].playerNickname,
            moveId: testMove.name,
        });
        executeMove(move, {}, getTurnMeta(1));
        expect(callCounter).toBe(1);
        // Check changing turn after move
        expect(roomGameData.gameState.coreState.turnOrder).toEqual({
            activePlayer: '1',
            nextPlayer: '2',
            playOrder,
            activePlayerIndex: 1,
        });
        // Check phase change by move
        expect(roomGameData.gameState.coreState.phase).toBe('phase2');
        // Check history records
        let reducedHistory = roomGameData.gameState.coreState.history.map(reduceHistory);
        expect(roomGameData.gameState.coreState.history).toHaveLength(5);
        expect(reducedHistory).toEqual(firstHistoryCheckArray);
        // Check end game condition
        expect(roomGameData.gameState.coreState.gameInProgress).toBe(true);

        // Run second turn
        executeMove(move, {}, getTurnMeta(0));
        expect(callCounter).toBe(2);
        // Check not changing turn after move that ends game
        expect(roomGameData.gameState.coreState.turnOrder).toEqual({
            activePlayer: '1',
            nextPlayer: '2',
            playOrder,
            activePlayerIndex: 1,
        });
        // Check phase change by move
        expect(roomGameData.gameState.coreState.phase).toBe('phase1');
        // Check history records
        reducedHistory = roomGameData.gameState.coreState.history.map(reduceHistory);
        expect(roomGameData.gameState.coreState.history).toHaveLength(8);
        expect(reducedHistory).toEqual(secondHistoryCheckArray);

        // Check end game condition
        expect(roomGameData.gameState.coreState.gameInProgress).toBe(false);
        expect(roomGameData.gameState.coreState.endResult).toEqual({
            winner: '1',
            isTie: false,
            reason: MESSAGE,
        });
        // Check afterGameEnd
        expect(endGameMessage).toBe(MESSAGE);

        // Cleanup
        removeRoomGameData(roomId);
    });
});
