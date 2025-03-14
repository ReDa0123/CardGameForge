import { useSelector } from 'react-redux';
import { isInLobby } from '../../selectors';
import { GameFinder } from './GameFinder';
import React from 'react';
import { GameLobby } from './GameLobby';

type GameConnectProps = {
    minNumberOfPlayers: number;
    maxNumberOfPlayers: number;
    title?: string;
    GameOptionsFormComponent?: React.ComponentType<any>;
    gameOptions?: Record<string, any>;
    setGameOptions?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};

/**
 * GameConnect component that displays the game lobby or the game finder based on the current state of the game.
 * @param minNumberOfPlayers - The minimum number of players required to start the game.
 * @param maxNumberOfPlayers - The maximum number of players allowed in the game.
 * @param title - The title of the game.
 * @param GameOptionsFormComponent - The component to display when the game options are being set.
 * @param gameOptions - The game options.
 * @param setGameOptions - The function to set the game options.
 */
export const GameConnect: React.FC<GameConnectProps> = ({
    minNumberOfPlayers,
    maxNumberOfPlayers,
    title,
    GameOptionsFormComponent,
    gameOptions,
    setGameOptions,
}) => {
    const inLobby = useSelector(isInLobby);
    return inLobby ? (
        <GameLobby
            minNumberOfPlayers={minNumberOfPlayers}
            maxNumberOfPlayers={maxNumberOfPlayers}
            title={title}
            GameOptionsFormComponent={GameOptionsFormComponent}
            gameOptions={gameOptions}
            setGameOptions={setGameOptions}
        />
    ) : (
        <GameFinder title={title} />
    );
};
