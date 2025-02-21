import { ActionDefinition, AddHookFn, MoveDefinition, RemoveHookFn } from './gameState';

export type ActionRegistry<
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = {
    actions: {
        [actionName: string]: ActionDefinition<unknown, CS, CGO, CZ, CC>;
    };
    addAction: <T>(action: ActionDefinition<T, CS, CGO, CZ, CC>) => void;
    removeAction: (actionName: string) => void;
    getAction: <T>(actionName: string) => ActionDefinition<T, CS, CGO, CZ, CC>;
    addBeforeHook: AddHookFn<CS, CGO, CZ, CC>;
    removeBeforeHook: RemoveHookFn;
    addAfterHook: AddHookFn<CS, CGO, CZ, CC>;
    removeAfterHook: RemoveHookFn;
};

export type MovesRegistry<
    CS,
    CGO,
    CZ extends Record<string, any>,
    CC extends Record<string, any>
> = {
    moves: {
        [moveName: string]: MoveDefinition<unknown, CS, CGO, CZ, CC>;
    };
    addMove: <P>(move: MoveDefinition<P, CS, CGO, CZ, CC>) => void;
    removeMove: (moveName: string) => void;
    getMove: <P>(moveName: string) => MoveDefinition<P, CS, CGO, CZ, CC> | undefined;
};
