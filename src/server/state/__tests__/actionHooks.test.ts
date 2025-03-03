import {
    ActionTemplate,
    CardTemplate,
    ConfigZone,
    GameConfig,
    MoveDefinition,
    NetworkState,
} from '../../types';
import { actionTypes, AddToZonePayload, ChangePhasePayload, ChangeZonePayload } from '../actions';
import {
    executeMove,
    getRoomGameData,
    prepareGameState,
    removeRoomGameData,
    setLoadedConfig,
} from '../gameState';
import { expect } from '@jest/globals';
import { EndGameResult } from '../../../shared/types/gameState';

const PERMANENT_HOOK = 'permanentHook';
const ONCE_HOOK = 'onceHook';
const CONDITIONAL_HOOK = 'conditionalHook';
const roomId = 'testRoom';

const calls = {
    permanent: 0,
    once: 0,
    conditional: 0,
    after: 0,
    card: 0,
};

const addHooks: MoveDefinition<any, any, any, Record<string, any>, Record<string, any>> = {
    name: 'addHooks',
    execute: (_, ctx) => {
        // Permanent hook
        ctx.addBeforeHook<ChangePhasePayload>(actionTypes.CHANGE_PHASE, PERMANENT_HOOK, () => {
            calls.permanent++;
            return { phase: 'phase2' };
        });
        ctx.addBeforeHook<ChangeZonePayload>(
            actionTypes.CHANGE_ZONE,
            ONCE_HOOK,
            () => {
                calls.once++;
                return {};
            },
            { once: true }
        );
        ctx.addBeforeHook<ChangeZonePayload>(
            actionTypes.CHANGE_ZONE,
            CONDITIONAL_HOOK,
            () => {
                calls.conditional++;
                return {};
            },
            {
                removeCond: () => {
                    return calls.conditional >= 2;
                },
            }
        );
        ctx.addAfterHook<ChangePhasePayload>(actionTypes.CHANGE_PHASE, 'afterHook', () => {
            calls.after++;
            if (calls.after > 2) {
                return { ABORT: true };
            }
            return {};
        });
    },
    message: () => 'Adding hooks',
};

const performActions: MoveDefinition<any, any, any, Record<string, any>, Record<string, any>> = {
    name: 'performActions',
    execute: (_, ctx, meta) => {
        ctx.dispatchAction<ChangePhasePayload>(actionTypes.CHANGE_PHASE, { phase: 'phase1' }, meta);
        const fromZoneId = calls.permanent % 2 === 1 ? testZone1.zoneId : `${testZone2.zoneId}_1`;
        const toZoneId = calls.permanent % 2 === 0 ? testZone1.zoneId : `${testZone2.zoneId}_1`;
        ctx.dispatchAction<ChangeZonePayload>(
            actionTypes.CHANGE_ZONE,
            { cardId: 'testCard_0', fromZoneId, toZoneId },
            meta
        );
    },
    message: () => 'Performing hooks',
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

const noop = (...args: any[]) => {
    return args;
};

const card: CardTemplate<Record<string, any>> = {
    id: 'testCard',
    name: 'Test Card',
    displayType: 'card',
    actions: {
        [actionTypes.CHANGE_PHASE]: (payload: ChangePhasePayload, ctx, cardId, meta) => {
            noop(payload, ctx, cardId, meta);
            calls.card++;
        },
    },
};

const cardCollection = [card];

const playOrder = ['2', '1'];

const mockGameConfig: GameConfig<any, any, Record<string, any>, Record<string, any>> = {
    name: 'TestGame',
    minPlayers: 2,
    maxPlayers: 4,
    moves: [addHooks, performActions],
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
        return null;
    },
    playOrder: () => playOrder,
    afterGameEnd: (ctx) => {
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

describe('Hooks test', () => {
    it('should perform the hook mechanism', () => {
        // Setup
        setLoadedConfig<any, any, Record<string, any>, Record<string, any>>(mockGameConfig);
        prepareGameState<any, any, Record<string, any>, Record<string, any>>(
            roomId,
            mockGameConfig,
            mockNetworkState
        );

        const roomGameData = getRoomGameData(roomId)!;

        const addHooksMove = roomGameData.movesRegistry.getMove(addHooks.name)!;
        const performActionsMove = roomGameData.movesRegistry.getMove(performActions.name)!;
        const meta = { roomId, timestamp: new Date() };
        executeMove(addHooksMove, {}, meta);
        executeMove(performActionsMove, {}, meta);
        expect(calls.permanent).toBe(1);
        expect(roomGameData.gameState.coreState.phase).toBe('phase2');
        expect(calls.once).toBe(1);
        expect(calls.conditional).toBe(1);
        expect(calls.after).toBe(1);
        expect(calls.card).toBe(1);

        executeMove(performActionsMove, {}, meta);
        expect(calls.permanent).toBe(2);
        expect(calls.once).toBe(1);
        expect(calls.conditional).toBe(2);
        expect(calls.after).toBe(2);
        expect(calls.card).toBe(2);

        executeMove(performActionsMove, {}, meta);
        expect(calls.permanent).toBe(3);
        expect(calls.once).toBe(1);
        expect(calls.conditional).toBe(2);
        expect(calls.after).toBe(3);
        expect(calls.card).toBe(2);
        // Cleanup
        removeRoomGameData(roomId);
    });
});
