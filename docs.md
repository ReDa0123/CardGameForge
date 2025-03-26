# Library CardGameForge

These are the docs for the library called CardGameForge that allows you to create card game prototypes quickly using React and Node.js. It comes with a server authoritative game state management synchronised to all joined clients using WebSockets (with the help of the Socket.io library). The client side of this library offers pre-made game context that joins to the server effortlessly and with components that are used in almost every card game you might think of.

In the next sections you can learn about the concepts used for building a card game prototype with CardGameForge
(and brief description of the library architecture) and an API reference for the available functions, types and UI components
offered to you by CardGameForge.

## Installation

To install CardGameForge, run:
`npm install cardgameforge`\
If you want to use custom MUI theme install also the MUI package:
`npm install @mui/material @emotion/react @emotion/styled`

## Concepts and architecture

CardGameForge is a library that allows you to create card game prototypes quickly using React and Node.js.
The library is designed to be flexible and easy to use, with a focus on game logic and UI development with help of pre-made components.
The concepts are mostly borrowed from board games in general but are enhanced with the card game specifics.\
The architecture of state management and communication is based on the server authoritative model where the server holds the game state and synchronises it with all connected clients
as well as event driven architecture used in WebSockets and Redux-style state management.

### Concepts

#### Game State

The game state in CardGameForge is divided into four logical parts:

-   Core state: Managed by the library, contains universal elements for card games
-   Custom state: User-defined state for specific game mechanics
-   Game options: Configuration options set before game start
-   Network state: Connection data and player information

#### Phases

Phases represent logical segments of the game that define which moves players can make. Each phase has a unique identifier and can specify which phase follows it. Phases are defined in the initial game configuration.

#### Actions

Actions are operations that change the game state, similar to Redux actions. Each action has a unique identifier and an apply function that receives state context, payload, and metadata. The library provides pre-made actions and allows defining custom ones.

Actions can be enhanced with hooks that modify their behavior:

-   Before hooks: Modify the action's payload before execution. They can return partial payload changes or abort the action by setting `ABORT: true`
-   After hooks: Execute after the action completes, useful for triggering side effects or additional actions

Cards can also react to actions through their `actions` property, which defines specific behaviors when certain actions are dispatched. These reactions are automatically triggered after the action and its hooks complete.

The library provides pre-made actions for common operations like changing phases, managing turn order, moving cards between zones, and more. All actions are validated on the server and recorded in the game history.

#### Moves

Moves represent player decisions during the game. Each move has a name, execution logic, conditions for when it can be performed, and a descriptive message. Moves are validated on the server and can trigger multiple actions.

#### Turn Order

Turn order manages active player rotation and is stored in the core state. It includes the active player, next player, player order list, and active player index, making it easy to manage player turns.

#### End Game Condition

Defines when and how the game ends, specified in the initial configuration. The condition is checked after each state change and can determine winners or declare ties.

#### History

The game maintains a history of moves and actions, useful for debugging and showing players what happened. History can be exported and used to modify action/move behavior based on past events.

#### Card Selection

Card selection is managed client-side, allowing players to temporarily mark cards for moves. The selection state is local to each client and not shared with the server.

#### Zones and Cards

The library uses three main structures:

-   Zone: A space where cards can be placed (e.g., deck, hand)
-   CardTemplate: Blueprint for creating card instances
-   Card: Actual card instance in the game with dynamic state

### Modules

The library contains two main modules: `cardgameforge/server` and `cardgameforge/client`.
The server module is used to create a game server with Node.js, while the client module is used to create a game client with React.\
These modules communicate with each other using WebSockets (with the help of the Socket.io library) to synchronise the game state across all connected clients.
The communication part is handled completely by the library, so you can focus on the game logic and UI.

## API Reference

Below is the API reference for the CardGameForge library. The library is divided into two main modules: `server` and `client`.
The `server` module is used to create a game server, while the `client` module is used to create a game client.
When you want to import from the server module, use the following import statement:

```
import ... from 'cardgameforge/server';
```

When you want to import from the client module, use the following import statement:

```
import ... from 'cardgameforge/client';
```

### Server

#### Types

##### General

Below are the general types used in the server module.

-   `Metadata` - Metadata object passed to the move and action functions
    -   `playerId?: string` - Player ID that triggered the move or action
    -   `teamId?: string` - Team ID of the player that triggered the move or action
    -   `playerNickname?: string` - Player nickname that triggered the move or action
    -   `timestamp: Date` - Timestamp of the move or action
    -   `moveId?: string` - Move ID of the triggered move
    -   `roomId: string` - Room ID of the game
    -   `actionId?: string` - Action ID of the triggered action
    -   `hookId?: string` - Hook ID of the triggered hook
-   `ExtendedPayload<Payload>` - A helper type to extend payloads with the ABORT prop that is used to abort execution of actions by action hooks
-   `ServerOptions` - Socket.IO server configuration options passed to the `setupAndRunServer` function.

##### GameConfig

Game config is the main type used to set up the game. It contains all the necessary information about the game, such as the game name,
minimum and maximum number of players, game moves, actions, phases, and more.\
It is passed to the `setupAndRunServer` function to set up the game server. It is where you define the game logic and rules.

-   `GameConfig<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Configuration type for game setup. You can pass custom types for your custom game state, game options, zones props, and cards props.

    -   `name: string` - Name of the game
    -   `minPlayers: number` - Minimum number of players required
    -   `maxPlayers: number` - Maximum number of players allowed
    -   `customState?: CustomState` - Initial custom game state that is unique to your card game prototypes
    -   `moves: MoveDefinition[]` - Array of available game moves in a form of move definitions
    -   `actions: ActionTemplate[]` - Array of available game actions in a form of action templates
    -   `randomSeed?: string | number` - Seed used by the randomize functions provided by the library in the state context
    -   `playOrder?: (ctx: StateContext) => string[]` - Function to determine initial player order. If not provided, players are ordered by joining order
    -   `phases: { first: string, phasesList: PhaseDefinition[] }` - Game phases configuration. You can define the first phase and the list of phases in a form of phase definitions
    -   `endGameCondition: (ctx: StateContext<CustomState, CustomGameOptions, CustomZone, CustomCard>) => EndGameResult | null` - Function to check game end condition. It should return null if the game is not over and an object with the winner, isTie, and reason if the game is over
    -   `afterGameEnd: ( ctx: StateContext<CustomState, CustomGameOptions, CustomZone, CustomCard>, result: EndGameResult, meta: Metadata ) => GameState<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Function called after game ends. It should return the new game state
    -   `defaultCustomGameOptions: CustomGameOptions` - Default game options
    -   `zones: ConfigZone[]` - Array of game zones configuration used in your game
    -   `cardCollection: CardTemplate[]` - Array of card templates. From these templates, the card instances can be created using the `createCardFromTemplate` function in the state context
    -   `gameSetup: (ctx: StateContext<CustomState, CustomGameOptions, CustomZone, CustomCard>, meta: Metadata) => GameState<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Function to set up initial game state when game is started from the lobby. It should return the new game state
    -   `logErrors?: boolean` - Whether to log errors such as invalid moves and actions

-   `MoveDefinition<Payload, CustomState, CustomGameOptions, CustomZone, CustomCard>` - Definition of a game move.
    You can pass custom types for the payload of that move and your custom game state, game options, zones props, and cards props.

    -   `name: string` - Move name and identifier
    -   `allowedPhases?: string[]` - Phases in which the move is allowed
    -   `canExecute?: ( payload: Payload, ctx: StateContext<CustomState, CustomGameOptions, CustomZone, CustomCard>, meta: Metadata ) => { canExecute: boolean; reason?: string }` - Function to check if the move can be executed
    -   `execute: ( payload: Payload, ctx: StateContext<CustomState, CustomGameOptions, CustomZone, CustomCard>, meta: Metadata ) => void` - Function to execute the move
    -   `message: (payload: Payload, ctx: StateContext<CustomState, CustomGameOptions, CustomZone, CustomCard>, meta: Metadata) => string` - Function to create a move message for the history record (for example: "Player 1 played a card: 'Card name'")
    -   `changeTurnAfter?: boolean` - Whether to change the turn after the move is executed determined by the turn order

-   `ActionTemplate<Payload, CustomState, CustomGameOptions, CustomZone, CustomCard>` - Template for a game action.
    You can pass custom types for the payload of that action and your custom game state, game options, zones props, and cards props.

    -   `name: string` - Action name and identifier
    -   `apply: ( payload: ActionPayload, ctx: StateContext<CustomState, CustomGameOptions, CustomZone, CustomCard>, meta: Metadata ) => GameState<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Function to apply the action to the game state. Return should be a new copy of the whole game state.

-   `PhaseDefinition` - Definition of a game phase

    -   `name: string` - Phase name and identifier
    -   `next?: string` - Next phase identifier

-   `EndGameResult` - Result of the game end condition function

    -   `winner?: string` - Player or team ID of the winner
    -   `isTie: boolean` - Whether the game ended in a tie
    -   `reason?: string` - Message for the game end

-   `ConfigZone<CustomZone>` - Configuration of a game zone. You can pass custom types for your custom zone properties.
    -   `zoneId: string` - Zone identifier
    -   `zoneName: string` - Human readable zone name
    -   `isPerPlayer?: boolean` - Whether the zone is per player (for example each player has their own hand)
    -   `custom?: CustomZone` - Initial custom zone properties

##### Game Objects

Below are the types used to define the game objects used in nearly every card game - cards and zones that hold the cards.

-   `Zone<CustomZone, CustomCard>` - Game zone object. You can pass custom types for your custom zone properties and card properties.

    -   `id: string` - Zone identifier
    -   `name: string` - Human readable zone name
    -   `type?: string` - Zone type used if the zone is per player (for example hand has id of something like 'hand_player1' but type 'hand')
    -   `owner?: string` - Owner of the zone used if the zone is per player
    -   `cards: Card<CustomCard>[]` - Array of cards in this zone
    -   `custom?: CustomZone` - Custom zone properties

-   `CardTemplate<CustomCard>` - Template for a card. You can pass custom types for your custom card properties.

    -   `id: string` - Card identifier
    -   `name: string` - Human readable card name
    -   `displayType: string` - Card display type used by the display registry on the client to determine the component to render
    -   `moves?: { [moveName: string]: Pick<MoveDefinition, 'canExecute' | 'execute'> }` - You can define specific moves for this card
    -   `actions?: { [actionType: string]: ( payload: any, ctx: StateContext, cardId: string, meta: Metadata ) => void }` - You can define card reactions for specific actions that are triggered when dispatching the action
    -   `custom?: CustomCard` - Custom card properties

-   `Card<CustomCardTemplate, DisplayProps, CardState>` - Card instance object created from `CardTemplate`. You can pass custom types for your custom card template, display properties, and specific card state.
    -   `id: string` - Card identifier
    -   `templateId: string` - Card template identifier
    -   `templateFields: Pick<CardTemplate<CustomCardTemplate>, 'name' | 'displayType' | 'moves' | 'actions' | 'custom'>` - Card template fields from which the card was created
    -   `state?: CardState` - Card state properties
    -   `displayProps?: DisplayProps` - Display properties

##### Game state

Below are the types used to define the game state used on the server for each game room.

-   `GameState<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Complete game state on the server. You can pass custom types for your custom game state, game options, zones props, and cards props.

    -   `coreState` - Core game state managed mostly by the library
        -   `gameInProgress: boolean` - Whether the game is in progress
        -   `endResult: EndGameResult | null` - Game end result, if the game is over, null otherwise
        -   `phase: string` - Current game phase
        -   `turnOrder: TurnOrder` - Turn order of the players
        -   `teams: Teams | null` - Teams mapping of the player IDs to team IDs
        -   `cardCollection: CardTemplate<CustomCard>[]` - Array of card templates
        -   `zones: { [zoneId: string]: Zone<CustomZone, CustomCard> }` - Current state of the game zones
        -   `history: HistoryRecord<unknown>[]` - Array of history records that can be exported using the `exportHistory` function from the state context
        -   `randomSeed?: string | number` - Random seed used by the randomize functions provided by the library in the state context
    -   `customState: CustomState` - Custom game state
    -   `gameOptions: CustomGameOptions` - Game options
    -   `networkState: NetworkState` - Network state

-   `NetworkState` - Network connection state of a game room. It is null only when initializing the game state, when you use it, it will always be defined.

    -   `roomId?: string` - Current room ID
    -   `players?: { playerId: string, playerNickname: string }[]` - Connected players with their IDs and nicknames

-   `TurnOrder` - Turn order of the players

    -   `playOrder: string[]` - Array of player IDs in the play order
    -   `activePlayer: string | 'EVERYBODY'` - Active player ID or if everyone is active
    -   `nextPlayer: string` - Next player ID
    -   `activePlayerIndex: number` - Index of the active player in the play order array

-   `Teams` - Teams mapping of the player IDs to team IDs

    -   `{ [teamId: string]: string[] }` - Mapping of team IDs to arrays of player IDs

-   `HistoryRecord<Payload>` - History record object. You can pass the payload of the action/move.
    -   `recordType: 'MOVE' | 'ACTION' | 'SYSTEM'` - Type of the history record - move, action, or system record (for example message Game started)
    -   `actionName?: string` - Action name if the record type is 'ACTION'
    -   `moveId?: string` - Move ID if the record type is 'MOVE'
    -   `payload?: Payload` - Payload of the action/move
    -   `originalPayload?: Payload` - Original payload of the action/move that was not changed by action hooks yet
    -   `payloadHistory?: { payload: Payload; isInitial?: boolean; actionId?: string; hookId?: string; }[]` - Array of payload history records if the payload was changed by action hooks. Is initial is the identification of the original payload
    -   `meta: Metadata` - Metadata of the action/move
    -   `message?: string` - Message of the history record (usually move message or system message)
    -   `cardReactions?: string[]` - Array of card IDs that had reactions that triggered by the action

##### Game state context

Game context is used to pass information about game state in a game room and to provide functions to update the game state and other utility functions.
Below are the types used in the game context.

-   `StateContext<CustomState, CustomGameOptions, CustomZone, CustomCard>` - State context passed to logic functions when creating actions, moves and game config functions

    -   `getState: () => GameState<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Function to get the current game state
    -   `dispatchAction: <ActionPayload>( actionName: string, payload: ActionPayload, meta: Metadata ) => GameState<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Function to dispatch an action by action name to update the game state. Action hooks and card reactions are also triggered.
        At the end of the function execution end conditions are checked and the game state is updated.
    -   `randomize: <T>(array: T[]) => T[]` - Function to randomize an array using the random seed of the game if it is set, otherwise using random seed. Returns a new instance of the array.
    -   `getActionRegistry: () => ActionRegistry<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Function to get the action registry that holds all the registered actions
    -   `getMovesRegistry: () => MovesRegistry<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Function to get the moves registry that holds all the registered moves
    -   `addBeforeHook: AddHookFn<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Function to add a before hook to an action
    -   `addAfterHook: AddHookFn<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Function to add an after hook to an action
    -   `removeBeforeHook: (hookId: string, actionName: string) => void` - Function to remove a before hook from an action
    -   `removeAfterHook: (hookId: string, actionName: string) => void` - Function to remove an after hook from an action
    -   `exportHistory: (path: string, filename?: string) => void` - Function to export the game history to a file. You can pass filename otherwise it will have the current timestamp as its name
    -   `loadedConfig: GameConfig<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Loaded game config passed to the server setup function
    -   `createCardFromTemplate: <DisplayProps, CardState>( cardTemplate: CardTemplate<CustomCard>, displayProps?: DisplayProps, initialState?: CardState ) => Card<CustomCard, DisplayProps, CardState>` - Function to create a card instance from a card template. You can pass display properties and initial state

-   `AddHookFn<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Function to add a hook to an action
    -   `<ActionPayload>( actionName: string, hookId: string, hookApply: ( payload: ExtendedPayload<ActionPayload>, ctx: StateContext<CustomState, CustomGameOptions, CustomZone, CustomCard>, meta: Metadata ) => Partial<ExtendedPayload<ActionPayload>>, options?: { once?: boolean; removeCond?: ( payload: ExtendedPayload<Payload>, ctx: StateContext<CS, CGO, CZ, CC>, meta: Metadata ) => boolean; } ) => void` - Function to add a hook to an action. You can pass the hook ID, apply function that can change the payload and make side effects, and options that change the behavior of removal of the hook -
        once means that the hook will be removed after the first execution, removeCond is a function that determines if the hook should be removed

**Example of adding a hook to an action:**

```javascript
ctx.addBeforeHook <
    ChangeZonePayload >
    ('CHANGE_ZONE',
    'myHook',
    (payload, ctx, meta) => {
        return { ...payload, cardIds: 'card1' };
    },
    { once: true });
```

**Example of removing a hook from an action:**

```javascript
ctx.removeBeforeHook('myHook', 'CHANGE_ZONE');
```

**Example of dispatching an action:**

```javascript
ctx.dispatchAction <
    ChangeZonePayload >
    ('CHANGE_ZONE', { cardIds: 'card1', fromZoneId: 'hand', toZoneId: 'discard' }, meta);
```

**Example of randomizing an array:**

```javascript
const randomizedArray = ctx.randomize([1, 2, 3, 4, 5]);
```

**Example of exporting history:**

```javascript
ctx.exportHistory('./exports', `PrototypeHistory - ${new Date().toISOString()}.json`);
```

**Example of creating a card from a template:**

```javascript
const card = ctx.createCardFromTemplate(
    cardTemplate,
    { displayType: 'default' },
    { state: 'default' }
);
```

#### Functions

The main function for creating and running the game server is `setupAndRunServer`. It initializes the game server and runs it on the specified port.

-   `setupAndRunServer<CustomState, CustomGameOptions, CustomZone, CustomCard>(port?: number, opts?: Partial<ServerOptions>, gameConfig: GameConfig)`
    -   **Description**: Main function to initialize and run the game server. You can pass custom types for your custom game state, game options, zones props, and cards props.
    -   **Parameters**:
        -   `port?: number` - Port number to run the server on
        -   `opts?: Partial<ServerOptions>` - Socket.IO server configuration options
        -   `gameConfig: GameConfig<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Game configuration
    -   **Example**:
        ```javascript
        import { setupAndRunServer } from 'cardgameforge/server';
        setupAndRunServer < TichuState,
            TichuGameSettings,
            any,
            TichuCard > (3000, {}, tichuGameConfig);
        ```
-   `assocByDotPath<T>(obj: T, path: string, value: unknown): T`
    -   **Description**: Utility function you can use to update nested objects in the game state in action appliers. Returns a new instance of the object with the updated value.
    -   **Parameters**:
        -   `obj: T` - Object to update
        -   `path: string` - Dot path to the nested object (for example 'coreState.turnOrder.activePlayer')
        -   `value: unknown` - Value to set
    -   **Returns**: Updated object - copy of the original object with the updated value
    -   **Example**:
        ```javascript
        import { assocByDotPath } from 'cardgameforge/server';
        const updatedState = assocByDotPath(state, 'coreState.turnOrder.activePlayer', 'player2');
        ```

#### Constants

-   `historyRecordsTypes` - Types of history records that can be logged
-   `actionTypes` - Types of actions that can be dispatched out of the box
-   `EVERYBODY` - Constant used to set the active player to everybody

#### Actions

CardGameForge comes with pre-made actions that can be dispatched to the server to update the game state.
The actions are dispatched using the `dispatch` function provided by the `GameContext`. \
Each actions is identified by unique string that is used to dispatch the action - these identifiers are available in a mapping object `actionTypes` -
and an apply function that is used to update the game state. \
Bellow are the available actions with a description of what the apply function does and the payload type:

-   `APPEND_HISTORY`
    -   **Description**: Appends a history record to the game state
    -   **Payload**: `AppendHistoryPayload` - `HistoryRecord<unknown>` - History record to append
-   `END_GAME`
    -   **Description**: Ends the game
    -   **Payload**: `EndGamePayload` - `EndGameResult` - Game end result
-   `END_TURN`
    -   **Description**: Ends the current player's turn and passes the active player to the next in turn order
    -   **Payload**: `EndTurnPayload` - `object` - Empty object - is not used
-   `SET_TURN_ORDER`
    -   **Description**: Sets a new turn order for the game
    -   **Payload**: `SetTurnOrderPayload` - `TurnOrder` - New turn order
-   `CHANGE_PHASE`
    -   **Description**: Changes the current game phase. If the payload is empty string, the phase will be determined
        from the game config from the prop `next`.
    -   **Payload**: `ChangePhasePayload` - `{ phase: string }` - New phase identifier or empty string
-   `SET_TEAMS`
    -   **Description**: Sets the teams for the game
    -   **Payload**: `SetTeamsPayload` - `Teams` - Teams mapping of the player IDs to team IDs
-   `CHANGE_ZONE`
    -   **Description**: Moves selected cards' zone to another zone. Can pass multiple card IDs to change multiple cards' zones at once.
    -   **Payload**: `ChangeZonePayload` - `{ cardIds: string | string[], fromZoneId: string, toZoneId: string }` -
        Card IDs or single card ID, source zone ID, and destination zone ID
-   `ADD_TO_ZONE`
    -   **Description**: Adds card/s to a zone
    -   **Payload**: `AddToZonePayload` - `{ cards: Card | Card[], toZoneId: string }` - Card or array of cards to add and destination zone ID
-   `REMOVE_FROM_ZONE`
    -   **Description**: Removes card/s from a zone
    -   **Payload**: `RemoveFromZonePayload` - `{ cardIds: string | string[], fromZoneId: string }` - Card IDs or single card ID to be removed from source zone ID
-   `SHUFFLE_ZONE`
    -   **Description**: Shuffles the cards in a zone using the random seed of the game if it is set
    -   **Payload**: `ShuffleZonePayload` - `{ zoneId: string }` - ID of the zone to shuffle
-   `CHANGE_CARD`
    -   **Description**: Updates the state of a card. You can pass only the fields you want to change not the whole card.
    -   **Payload**: `ChangeCardPayload` - `{ cardId: string, zoneId: string, cardChanges: Partial<Card>; }` - Card ID, zone ID, and card changes
-   `SET_ACTIVE_PLAYER`
    -   **Description**: Sets the active player and changes other fields in the turn order in state to reflect that change.
        You can pass the force flag to force the `activePlayer` to change even if that player is not present in the play
        order array (note that only the `activePlayer` is changed and the other fields are not updated). You can also
        use the `EVERYBODY` constant to set the active player to everybody and use it to create multiplayer turns.
    -   **Payload**: `SetActivePlayerPayload` - `{ playerId: string | 'EVERYBODY'; force?: boolean; }` - Player ID or 'EVERYBODY' constant and optional force flag
-   `MOVE_CARDS_FROM_ZONE`
    -   **Description**: Moves all cards from one zone to another if `numberOfCards` is not provided.
        If `numberOfCards` is provided, move the specified number of first cards from the source zone to the destination zone.
    -   **Payload**: `MoveCardsFromZonePayload` - `{ fromZoneId: string; toZoneId: string; numberOfCards?: number; }` - Source zone ID, destination zone ID, and optional number of cards to move

**Example of creating own action:**

```javascript
import { ActionTemplate } from 'cardgameforge/server';
export const setScore: ActionTemplate<
    { score: number },
    CustomState,
    CustomGameOptions,
    CustomZone,
    CustomCard
> = {
    name: tichuActions.SET_ORIGINAL_PLAY_ORDER,
    apply: (payload, ctx) => {
        const score = payload.score;
        return {
            ...state,
            customState: {
                ...state.customState,
                score,
            },
        };
    },
};
```

### Client

In addition to the exported features listed below, `useSelector, useDispatch and createSelector` are exported so that you don't need to install `react-redux` separately.

#### Types

-   `ReduxState<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Redux game state that has only one prop - game - that holds the game state - same as at the server but enhanced with `NetworkState` and `selection: Selection`

    -   `game: GameState<CustomState, CustomGameOptions, CustomZone, CustomCard>` - Game state

-   `NetworkState` - A servers network state enhanced with client info

    -   `playerId?: string` - Current player's ID
    -   `playerNickname?: string` - Current player's nickname
    -   `roomId?: string` - Current room ID, undefined if client is not connected to a game room
    -   `players?: { playerId: string, playerNickname: string }[]` - Connected players to the room with their IDs and nicknames. Undefined if client is not connected to a game room

-   `Selection` - Selection state used for selecting cards in zones on the client

    -   `{ [zoneId: string]: string[]; }` - Mapping of zone IDs to arrays of selected card IDs

-   `DisplayRegistry` - Registry of card display components used by the `Zone` component. You can set different display components for card types in zones and default components.
    -   `default: React.ComponentType<{ card: Card<CustomCard>; zone: Zone<CustomZone, CustomCard>; }>` - Default card component for the display type
    -   `displayTypes?: { [displayType: string]: { defualt: React.ComponentType<{ card: Card<CustomCard>; zone: Zone<CustomZone, CustomCard>; }>, zones?: { [zoneId: string]: React.ComponentType<{ card: Card<CustomCard>; zone: Zone<CustomZone, CustomCard>; }> }} }` - Registry of display types in zones
        -   `default: React.ComponentType<{ card: Card<CustomCard>; zone: Zone<CustomZone, CustomCard>; }>` - Default card component for the display type in that zone for that display type
        -   `zones?: { [zoneId: string]: React.ComponentType<{ card: Card<CustomCard>; zone: Zone<CustomZone, CustomCard>; }> }` - Registry of card components for specific zone

#### Actions

There are no state changes happening on the client side except for the selection mechanism.
Below are the actions that can be dispatched using `useDispatch` function on the client to update the selected cards in zones in the client game state. These changes are local and do not affect the server game state.

-   `selectCard`

    -   **Description**: Selects a card in a zone
    -   **Payload**: `SelectCardPayload` - `{ zoneId: string, cardId: string }` - Zone ID and card ID for the card to be selected

-   `unselectCard`

    -   **Description**: Unselects a card in a zone
    -   **Payload**: `SelectCardPayload` - `{ zoneId: string, cardId: string }` - Zone ID and card ID for the card to be unselected

-   `unselectZone`

    -   **Description**: Unselects all cards in a zone
    -   **Payload**: `string` - Zone ID for the zone to be unselected

-   `unselectAll`
    -   **Description**: Unselects all cards in all zones
    -   **Payload**: `void` - No payload

**Example of dispatching an action on the client:**

```javascript
import { useDispatch, selectCard } from 'cardgameforge/client';
//...
const dispatch = useDispatch();
//...
dispatch(selectCard({ zoneId: 'hand', cardId: 'card1' }));
//...
```

#### Game Context

Exports game context functionality for managing game state and network communication - it hooks the events from the server and updates the game state on the client side.
You pass the display registry of the cards, sever URL address and can pass custom material theme if you don't want ot use the default one.
Use the `GameContextProvider` component to wrap your game with the game context.

-   `GameContextProvider`
    -   **Props**
        -   `displayRegistry: DisplayRegistry` - The display registry
        -   `serverAddress: string` - The server address
        -   `materialTheme?: Theme` - The material theme
        -   `children: React.ReactNode` - The game components

**Example of using the GameContextProvider:**

```javascript
import { GameContextProvider } from 'cardgameforge/client';
const displayRegistry = {
    default: DefaultCard,
    displayTypes: {
        card: {
            default: DefaultCard,
            zones: {
                hand: HandCard,
                deck: DeckCard,
                discard: DiscardCard,
            },
        },
    },
};
//...
<GameContextProvider displayRegistry={displayRegistry} serverAddress="http://localhost:3000">
    <Game />
</GameContextProvider>;
```

#### React hooks

CardGameForge provides hooks to access the game context and the socket instance, display registry, and to send moves to the server.

-   `useGameContext` - Hook to get the game context values
-   `useSocket` - Hook to get the socket instance from the game context
-   `useDisplayRegistry` - Hook to get the display component for a card
    -   **Parameters**:
        -   `cardId: string` - Card ID you want to get the display component for
        -   `zoneId: string` - Zone ID of the card
    -   **Returns**: Display component for the card
        type AllowedVariant = 'default' | 'error' | 'success' | 'warning' | 'info';
    -   **Example**:
        ```javascript
        import { useDisplayRegistry } from 'cardgameforge/client';
        const DisplayComponent = useDisplayRegistry('card1', 'hand_player1');
        return <DisplayComponent />;
        ```
-   `useNotification` - Hook to display a notification
    -   **Returns**: Function to display a notification
        -   **Parameters** (of the returned function):
            -   `message: string` - The message to display
            -   `variant: 'default' | 'error' | 'success' | 'warning' | 'info'` - The variant of the notification
        -   **Example**:
            ```javascript
            import { useNotification } from 'cardgameforge/client';
            const notify = useNotification();
            return <Box onClick={() => notify('Hello world!', 'info')}>Click me</Box>;
            ```
-   `useSendMove` - Hook to send a move to the server. You can pass the type of the payload of the move for type safety.
    -   **Parameters**:
        -   `moveId: string` - The id of the move
    -   **Returns**: Function to send a move to the server
        -   **Parameters** (of the returned function):
            -   `payload: Payload` - The payload of the move
        -   **Example**:
            ```javascript
            import { useSendMove } from 'cardgameforge/client';
            const sendMove = useSendMove < PlayCardPayload > 'PLAY_CARD';
            return <Box onClick={() => sendMove({ cardId: 'card1' })}>Click me</Box>;
            ```

#### Selectors

Selectors are used with `useSelector` hook to select specific parts of the game state. CardGameForge provides pre-made selectors for common use cases in the core state.
When creating your selectors you can use the `createSelector` function from the library to create memoized selectors and if your selector has arguments, you can use the `memoizeWithIdentity` utility function to memoize the selector with the arguments.

-   `getEndGameResult` - Selector to get the end game result from the redux state
-   `getTurnOrder` - Selector to get the turn order from the redux state
-   `getHistory` - Selector to get the history from the redux state
-   `getHistoryMessages` - Selector to get the history records with messages as an array of messages
-   `getHistoryMessagesWithTimestamps` - Selector to get the history records with messages as an array of messages with timestamps
-   `isGameActive` - Selector to check if the game is active - if you are connected to a room and game is in progress
-   `getNetworkInfo` - Selector to get the network info from the redux state
-   `getPlayerIds` - Selector to get the player ids from the redux state
-   `getPlayerNicknames` - Selector to get the player nicknames from the redux state
-   `getRoomPlayersCount` - Selector to get the number of players in the room from the redux state
-   `getRoomId` - Selector to get the room id from the redux state
-   `isInLobby` - Selector to check if the client is in the lobby
-   `getYourPlayerId` - Selector to get the clients player id from the redux state
-   `getSelection` - Selector to get the selection from the redux state
-   `getSelectedCardsInZone` - Selector to get the selected cards in a zone from the redux state
    -   `zoneId: string` - Zone ID for the selected cards
-   `isSelected` - Selector to check if a card is selected
    -   `cardId: string` - Card ID to check
    -   `zoneId: string` - Zone ID of the cards zone
-   `getTeams` - Selector to get the teams from the redux state
-   `getTeamPlayersByTeamId` - Selector to get the team players by team id from the redux state
    -   `teamId: string` - The id of the team
-   `getTeamPlayersByPlayerId` - Selector to get the team players by player id from the redux state
    -   `playerId: string` - The id of the player
-   `areTeammates` - Selector to check if two players are teammates
    -   `playerId1: string` - The id of the first player
    -   `playerId2: string` - The id of the second player
-   `getTurnOrder` - Selector to get the turn order from the redux state
-   `getCurrentPlayer` - Selector to get the current active player from the redux state
-   `areYouActivePlayer` - Selector to check if the current player is the active player
-   `getNextPlayer` - Selector to get the next player from the redux state
-   `getPlayOrder` - Selector to get the play order from the redux state
-   `getActivePlayerIndex` - Selector to get the active player index from the redux state
-   `getZones` - Selector to get all zones from the redux state
-   `findCardInZone` - Selector to find a card in a zone
    -   `cardId: string` - The id of the card
    -   `zoneId: string` - The id of the zone
-   `getZoneById` - Selector to get a zone by id
    -   `zoneId: string` - The id of the zone
-   `getZonesByZoneIds` - Selector to get zones by zone ids
    -   `zoneIds: string[]` - The ids of the zones
-   `getZoneOfCard` - Selector to get the zone of a card
    -   `cardId: string` - The id of the card
-   `getZoneCards` - Selector to get the cards of a zone
    -   `zoneId: string` - The id of the zone
-   `isPerPlayerZone` - Selector to check if a zone is per player
    -   `zoneId: string` - The id of the zone

**Example of using a selector:**

```javascript
import { useSelector, getEndGameResult } from 'cardgameforge/client';
//...
const endGameResult = useSelector(getEndGameResult); // Gets the end game result from the redux state
```

#### UI Components

CardGameForge provides pre-made UI components that you can use to build your game UI. Below are the available components.

-   `GameContainer` - Main container component for the game. It displays the game component when the game is active and the game connect component when the game is not active.

    -   **Props**:
        -   `GameComponent: React.ComponentType<any>` - The component to display when the game is active
        -   `minNumberOfPlayers: number` - The minimum number of players required to start the game
        -   `maxNumberOfPlayers: number` - The maximum number of players allowed in the game
        -   `title?: string` - The title of the game
        -   `GameOptionsFormComponent?: React.ComponentType<any>` - The component to display when the game options are being set
        -   `gameOptions?: Record<string, any>` - The game options that will be passed to the server when the game is started
        -   `setGameOptions?: React.Dispatch<React.SetStateAction<any>>` - The function to set the game options
        -   `title?: string` - The title of the game
    -   **Example**:
        ```javascript
        import { GameContainer } from 'cardgameforge/client';
        //...
        const [gameOptions, setGameOptions] = useState({ option1: 'value1' });
        <GameContainer
            GameComponent={Game}
            minNumberOfPlayers={2}
            maxNumberOfPlayers={4}
            title="My Game"
            GameOptionsFormComponent={GameOptionsForm}
            gameOptions={gameOptions}
            setGameOptions={setGameOptions}
        />;
        ```

-   `GameConnect` - Component to render game finder or game lobby if the player is not in a game. You won't probably use this component as it is rendered in the `GameContainer` when the game is not active.

    -   **Props**:
        -   `minNumberOfPlayers: number` - The minimum number of players required to start the game
        -   `maxNumberOfPlayers: number` - The maximum number of players allowed in the game
        -   `title?: string` - The title of the game
        -   `GameOptionsFormComponent?: React.ComponentType<any>` - The component to display when the game options are being set
        -   `gameOptions?: Record<string, any>` - The game options that will be passed to the server when the game is started
        -   `setGameOptions?: React.Dispatch<React.SetStateAction<any>>` - The function to set the game options

-   `GameFinder` - Component to find a game room to join with room id and player nickname form. You probably won't use this component as it is rendered in the `GameConnect` component.

    -   **Props**:
        -   `title?: string` - The title of the game

-   `GameLobby` - Component to display the game lobby. It displays the connected players and the form to change game options and the button to start the game. You probably won't use this component as it is rendered in the `GameConnect` component.

    -   **Props**:
        -   `minNumberOfPlayers: number` - The minimum number of players required to start the game
        -   `maxNumberOfPlayers: number` - The maximum number of players allowed in the game
        -   `GameOptionsFormComponent?: React.ComponentType<any>` - The component to display when the game options are being set
        -   `gameOptions?: Record<string, any>` - The game options that will be passed to the server when the game is started
        -   `setGameOptions?: React.Dispatch<React.SetStateAction<any>>` - The function to set the game options
        -   `title?: string` - The title of the game

-   `HistoryLog` - Component to display the history of the game. It is rendered in a stack and displays the timestamp and messages of history records.

    -   **Props**:
        -   `containerProps?: StackProps` - The props for the container stack that holds the history records
        -   `recordProps?: PaperProps` - The props for the record row
        -   `textProps?: TypographyProps` - The props for the text in the record
    -   **Example**:
        ```javascript
        import { HistoryLog } from 'cardgameforge/client';
        //...
        <HistoryLog />;
        ```

-   `HistoryPopup` - Component that displays the last message from the history. It uses the `useNotification` hook to display the message.

    -   **Props**: None
    -   **Example**:
        ```javascript
        import { HistoryPopup } from 'cardgameforge/client';
        //...
        <HistoryPopup />;
        ```

-   `Zone` - displays zone cards based on the zone id and style type. It uses the display registry to get the card display component. Per player zones are display face down card backs for other players by default.

    -   **Props**
        -   `zoneId: string` - The id of the zone you want the cards to be displayed from
        -   `styleType: 'hand' | 'deck' | 'pile'` - The style type of the zone cards. You can display them in a hand (fan or line), deck, or pile style
        -   `handStyle?: 'line' | 'fan'` - The style of the hand - only used if styleType is 'hand'
        -   `topCardsCount?: number` - The number of top cards to display - only used if styleType is 'deck' or 'pile'
        -   `zoneHandContainerProps?: BoxProps` - The props for the zone hand container
        -   `zoneHandCardContainerProps?: BoxProps` - The props for the zone hand card container
        -   `zoneDeckContainerProps?: BoxProps` - The props for the zone deck container
        -   `zoneDeckCardContainerProps?: BoxProps` - The props for the zone deck card container
        -   `zoneDeckBadgeProps?: BadgeProps` - The props for the zone deck badge
        -   `zonePileContainerProps?: BoxProps` - The props for the zone pile container
        -   `zonePileCardContainerProps?: BoxProps` - The props for the zone pile card container
        -   `CardProps?: any` - The props for the card
        -   `CardBackProps?: any` - The props for the card back
        -   `onCardClick?: (cardId: string, zoneId: string) => void` - The function to call when the card is clicked
        -   `onPileClick?: (zoneId: string) => void` - The function to call when the pile is clicked if styleType is 'pile'
        -   `showFirstCard?: boolean` - Whether to show the first card - only used if styleType is 'deck'
        -   `sortFn?: (cards: Card<any>[]) => Card<any>[]` - The function to call to sort the cards - only used if styleType is 'hand'
        -   `allFaceDown?: boolean` - Whether to show all cards face down - only used if styleType is 'pile'
    -   **Example**:
        ```javascript
        import { Zone } from 'cardgameforge/client';
        //...
        <Zone zoneId="deck" styleType="deck" topCardsCount={5} />;
        ```

-   `Card` - Component that displays a card in a zone based on the card id and zone id. It uses the display registry to get the card display component. It also handles the face down state of the card based on the zone owner and the current player.
    You probably won't use this component directly as it is used by the `Zone` component.

    -   **Props**:
        -   `cardId: string` - The id of the card
        -   `zoneId: string` - The id of the zone
        -   `isFaceDown?: boolean` - Whether the card is face down
        -   `onClick?: (cardId: string, zoneId: string) => void` - The function to call when the card is clicked
        -   `CardBackProps?: any` - The props for the card back
        -   `CardProps?: any` - The props for the card

-   `SelectedCards` - Component that displays the selected cards in a zone. By default, the onClick event will unselect the card.

    -   **Props**:
        -   `zoneId: string` - The id of the zone
        -   `title?: string` - The title above the selected cards
        -   `onCardClick?: (cardId: string, zoneId: string) => void` - The function to call when a card is clicked
        -   `containerProps?: BoxProps` - The props for the container for all cards
        -   `cardContainerProps?: BoxProps` - The props for the card container
        -   `paperProps?: PaperProps` - The props for the paper
        -   `titleProps?: TypographyProps` - The props for the title
    -   **Example**:
        ```javascript
        import { SelectedCards } from 'cardgameforge/client';
        //...
        <SelectedCards zoneId="hand_player1" title="Selected cards" />;
        ```

-   `SelectedCardsMultiZone` - Component that displays the selected cards in multiple zones. If zoneIds are provided, it will only display the selected cards in those zones. Otherwise, it will display all zones that have selected cards.
    -   **Props**:
        -   `zoneIds?: string[]` - The ids of the zones
        -   `title?: string` - The title of the selected cards
        -   `onCardClick?: (cardId: string, zoneId: string) => void` - The function to call when a card is clicked
        -   `containerProps?: BoxProps` - The props for the container
        -   `titleProps?: TypographyProps` - The props for the title
        -   `selectedCardsProps?: Omit<React.ComponentProps<typeof SelectedCards>, 'zoneId' | 'title' | 'onCardClick'>` - The props for the selected cards
    -   **Example**:
        ```javascript
        import { SelectedCardsMultiZone } from 'cardgameforge/client';
        //...
        <SelectedCardsMultiZone
            zoneIds={['hand_player1', 'hand_player2']}
            title="Selected cards"
        />;
        ```
