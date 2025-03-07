import {
    ActionTemplate,
    CardTemplate,
    ConfigZone,
    GameConfig,
    MoveDefinition,
    NetworkState,
} from '../../types';
import { actionTypes, AddToZonePayload, assocByDotPath, ChangePhasePayload } from '../actions';
import {
    executeMove,
    getRoomGameData,
    prepareGameState,
    removeRoomGameData,
    setLoadedConfig,
} from '../gameState';
import { expect } from '@jest/globals';
import { EndGameResult } from '../../../shared';

const roomId = 'testRoom';

type CustomState = {
    score: number;
};

type CustomGameOptions = {
    scoreToWin: number;
};

type CustomZone = {
    isSpecial: boolean;
};

type CustomCard = {
    isSpecial: boolean;
};

type ChangeCustomStatePayload = {
    score: number;
};

const CUSTOM_SET_SCORE = 'CUSTOM_SET_SCORE';
const customSetScoreAction: ActionTemplate<
    ChangeCustomStatePayload,
    CustomState,
    CustomGameOptions,
    CustomZone,
    CustomCard
> = {
    name: CUSTOM_SET_SCORE,
    apply: (payload, ctx) => {
        const state = ctx.getState();
        return assocByDotPath(state, 'customState.score', payload.score);
    },
};

const SCORE_TOO_HIGH = 'Score must be less than 100';

const changeCustomState: MoveDefinition<
    ChangeCustomStatePayload,
    CustomState,
    CustomGameOptions,
    CustomZone,
    CustomCard
> = {
    name: 'changeCustomState',
    allowedPhases: ['phase1'],
    canExecute: (_, ctx) => {
        const canExecute = ctx.getState().customState.score < 100;
        return {
            canExecute,
            reason: canExecute ? undefined : SCORE_TOO_HIGH,
        };
    },
    execute: (payload, ctx, meta) => {
        ctx.dispatchAction(CUSTOM_SET_SCORE, payload, meta);
    },
    message: () => 'Adding score',
};

const changePhase: MoveDefinition<
    ChangePhasePayload,
    CustomState,
    CustomGameOptions,
    CustomZone,
    CustomCard
> = {
    name: 'changePhase',
    execute: (payload, ctx, meta) => {
        ctx.dispatchAction<ChangePhasePayload>(actionTypes.CHANGE_PHASE, payload, meta);
    },
    message: () => 'Changing phase',
};

type SpecialChangeCustomStatePayload = {
    score: number;
    cardId: string;
};

const SPECIAL_ZONE_CARD = 'Card and zone must be special';

const specialChangeCustomState: MoveDefinition<
    SpecialChangeCustomStatePayload,
    CustomState,
    CustomGameOptions,
    CustomZone,
    CustomCard
> = {
    name: 'specialChangeCustomState',
    canExecute: (payload, ctx) => {
        const zoneTheCardIsIn = Object.values(ctx.getState().coreState.zones).find(({ cards }) =>
            cards.some((card) => card.id === payload.cardId)
        );
        if (!zoneTheCardIsIn) {
            return {
                canExecute: false,
                reason: 'Card not found',
            };
        }
        const card = zoneTheCardIsIn.cards.find((card) => card.id === payload.cardId);
        if (!card) {
            return {
                canExecute: false,
                reason: 'Card not found',
            };
        }

        const canExecute =
            !!card.templateFields.custom?.isSpecial && !!zoneTheCardIsIn.custom?.isSpecial;
        return {
            canExecute,
            reason: canExecute ? undefined : SPECIAL_ZONE_CARD,
        };
    },
    execute: (payload, ctx, meta) => {
        ctx.dispatchAction(CUSTOM_SET_SCORE, { score: payload.score }, meta);
    },
    message: () => 'Adding score from special card and zone',
};

const specialZone: ConfigZone<CustomZone> = {
    zoneId: 'testZone',
    zoneName: 'Test Zone',
    custom: { isSpecial: true },
};

const notSpecialZone: ConfigZone<CustomZone> = {
    zoneId: 'testZone2',
    zoneName: 'Test Zone 2',
    custom: { isSpecial: false },
};

const specialCard: CardTemplate<CustomCard> = {
    id: 'specialCard',
    name: 'Special Card',
    displayType: 'card',
    custom: { isSpecial: true },
};

const notSpecialCard: CardTemplate<CustomCard> = {
    id: 'notSpecialCard',
    name: 'Not Special Card',
    displayType: 'card',
    custom: { isSpecial: false },
};

const cardCollection = [specialCard, notSpecialCard];

const playOrder = ['1', '2'];

type DisplayProps = {
    isSpecial: boolean;
};

type CustomCardState = {
    isSpecial: boolean;
};

const getEndGameResult = (activePlayer: string): EndGameResult => ({
    winner: activePlayer,
    isTie: false,
    reason: 'Score reached',
});

const mockGameConfig: GameConfig<CustomState, CustomGameOptions, CustomZone, CustomCard> = {
    name: 'TestGame',
    minPlayers: 2,
    maxPlayers: 2,
    moves: [changeCustomState, specialChangeCustomState, changePhase],
    actions: [customSetScoreAction],
    randomSeed: 42,
    phases: {
        first: 'phase1',
        phasesList: [
            { name: 'phase1', next: 'phase2' },
            { name: 'phase2', next: 'phase1' },
        ],
    },
    endGameCondition: (ctx): EndGameResult | null => {
        const state = ctx.getState();
        const activePlayer = state.coreState.turnOrder.activePlayer;
        if (state.customState.score >= state.gameOptions.scoreToWin) {
            return getEndGameResult(activePlayer);
        }
        return null;
    },
    playOrder: () => playOrder,
    afterGameEnd: (ctx) => {
        return ctx.getState();
    },
    defaultCustomGameOptions: { scoreToWin: 500 },
    customState: { score: 0 },
    zones: [specialZone, notSpecialZone],
    cardCollection,
    gameSetup: (ctx, meta) => {
        for (const cardTemplate of ctx.getState().coreState.cardCollection) {
            const displayProps = { isSpecial: cardTemplate.id === 'specialCard' };
            const cardState = { isSpecial: cardTemplate.id === 'specialCard' };
            const cardInstance1 = ctx.createCardFromTemplate<DisplayProps, CustomCardState>(
                cardTemplate,
                displayProps,
                cardState
            );
            const cardInstance2 = ctx.createCardFromTemplate<DisplayProps, CustomCardState>(
                cardTemplate,
                displayProps,
                cardState
            );
            ctx.dispatchAction<AddToZonePayload>(
                actionTypes.ADD_TO_ZONE,
                { cards: cardInstance1, toZoneId: specialZone.zoneId },
                meta
            );
            ctx.dispatchAction<AddToZonePayload>(
                actionTypes.ADD_TO_ZONE,
                { cards: cardInstance2, toZoneId: notSpecialZone.zoneId },
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

describe('Custom fields and constraints test', () => {
    it('should perform the hook mechanism', () => {
        // Setup
        setLoadedConfig<CustomState, CustomGameOptions, CustomZone, CustomCard>(mockGameConfig);
        prepareGameState<CustomState, CustomGameOptions, CustomZone, CustomCard>(
            roomId,
            mockGameConfig,
            mockNetworkState
        );

        const roomGameData = getRoomGameData<
            CustomState,
            CustomGameOptions,
            CustomZone,
            CustomCard
        >(roomId)!;

        // Check custom state and custom game options
        expect(roomGameData.gameState.customState.score).toBe(0);
        expect(roomGameData.gameState.gameOptions.scoreToWin).toBe(500);

        const meta = { roomId, timestamp: new Date() };

        // Can perform custom state change now
        const { didExecute, reason } = executeMove<
            ChangeCustomStatePayload,
            CustomState,
            CustomGameOptions,
            CustomZone,
            CustomCard
        >(changeCustomState, { score: 200 }, meta);
        expect(didExecute).toBe(true);
        expect(reason).toBe(undefined);
        expect(roomGameData.gameState.customState.score).toBe(200);

        // Cannot perform custom state change now because score is 200
        const { didExecute: didExecute2, reason: reason2 } = executeMove<
            ChangeCustomStatePayload,
            CustomState,
            CustomGameOptions,
            CustomZone,
            CustomCard
        >(changeCustomState, { score: 200 }, meta);
        expect(didExecute2).toBe(false);
        expect(reason2).toBe(SCORE_TOO_HIGH);
        expect(roomGameData.gameState.customState.score).toBe(200);

        //Change phase and try to change custom state
        executeMove<ChangePhasePayload, CustomState, CustomGameOptions, CustomZone, CustomCard>(
            changePhase,
            { phase: 'phase2' },
            meta
        );
        const { didExecute: didExecute3, reason: reason3 } = executeMove<
            ChangeCustomStatePayload,
            CustomState,
            CustomGameOptions,
            CustomZone,
            CustomCard
        >(changeCustomState, { score: 200 }, meta);
        expect(didExecute3).toBe(false);
        expect(reason3).toBe(`Move ${changeCustomState.name} not allowed in phase phase2`);
        expect(roomGameData.gameState.customState.score).toBe(200);

        // Try special change with not special card in special zone
        const { didExecute: didExecute4, reason: reason4 } = executeMove<
            SpecialChangeCustomStatePayload,
            CustomState,
            CustomGameOptions,
            CustomZone,
            CustomCard
        >(specialChangeCustomState, { score: 600, cardId: `${notSpecialCard.id}_0` }, meta);
        expect(didExecute4).toBe(false);
        expect(reason4).toBe(SPECIAL_ZONE_CARD);
        expect(roomGameData.gameState.customState.score).toBe(200);

        // Try special change with special card in not special zone
        const { didExecute: didExecute5, reason: reason5 } = executeMove<
            SpecialChangeCustomStatePayload,
            CustomState,
            CustomGameOptions,
            CustomZone,
            CustomCard
        >(specialChangeCustomState, { score: 600, cardId: `${specialCard.id}_1` }, meta);
        expect(didExecute5).toBe(false);
        expect(reason5).toBe(SPECIAL_ZONE_CARD);
        expect(roomGameData.gameState.customState.score).toBe(200);

        // Try special change with special card in special zone
        const { didExecute: didExecute6, reason: reason6 } = executeMove<
            SpecialChangeCustomStatePayload,
            CustomState,
            CustomGameOptions,
            CustomZone,
            CustomCard
        >(specialChangeCustomState, { score: 600, cardId: `${specialCard.id}_0` }, meta);
        expect(didExecute6).toBe(true);
        expect(reason6).toBe(undefined);
        expect(roomGameData.gameState.customState.score).toBe(600);

        // Check game end
        expect(roomGameData.gameState.coreState.gameInProgress).toBe(false);
        expect(roomGameData.gameState.coreState.endResult).toEqual(getEndGameResult('1'));

        // Cleanup
        removeRoomGameData(roomId);
    });
});
