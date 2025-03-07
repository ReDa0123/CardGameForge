import { actionTypes, assocByDotPath } from './state';
import setupAndRunServer from './serverSetup';
import { historyRecordsTypes } from './constants';
import {
    AppendHistoryPayload,
    EndGamePayload,
    EndTurnPayload,
    SetTurnOrderPayload,
    ChangePhasePayload,
    SetTeamsPayload,
    ChangeZonePayload,
    AddToZonePayload,
    RemoveFromZonePayload,
    ShuffleZonePayload,
    ChangeCardPayload,
    SetActivePlayerPayload,
    MoveCardsFromZonePayload,
} from './state';
import { ServerOptions } from 'socket.io';

export * from './types';
export * from '../shared';

export type { ServerOptions };

export {
    setupAndRunServer,
    actionTypes,
    assocByDotPath,
    historyRecordsTypes,
    AppendHistoryPayload,
    EndGamePayload,
    EndTurnPayload,
    SetTurnOrderPayload,
    ChangePhasePayload,
    SetTeamsPayload,
    ChangeZonePayload,
    AddToZonePayload,
    RemoveFromZonePayload,
    ShuffleZonePayload,
    ChangeCardPayload,
    SetActivePlayerPayload,
    MoveCardsFromZonePayload,
};
