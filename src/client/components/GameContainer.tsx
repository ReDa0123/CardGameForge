import { useSelector } from 'react-redux';
import React from 'react';
import { isGameActive } from '../selectors';
import { GameConnect } from './GameConnect';

type GameContainerProps = {
    GameComponent: React.ComponentType<any>;
    minNumberOfPlayers: number;
    maxNumberOfPlayers: number;
    title?: string;
    GameOptionsFormComponent?: React.ComponentType<any>;
    gameOptions?: Record<string, any>;
    setGameOptions?: React.Dispatch<React.SetStateAction<any>>;
};

/**
 * GameContainer component that displays the game or the game connect component based on the current state of the game.
 * @param GameComponent - The component to display when the game is active
 * @param minNumberOfPlayers - The minimum number of players required to start the game
 * @param maxNumberOfPlayers - The maximum number of players allowed in the game
 * @param GameOptionsFormComponent - The component to display when the game options are being set
 * @param gameOptions - The game options
 * @param setGameOptions - The function to set the game options
 * @param title - The title of the game
 */
export const GameContainer = ({
    GameComponent,
    maxNumberOfPlayers,
    minNumberOfPlayers,
    title,
    GameOptionsFormComponent,
    gameOptions,
    setGameOptions,
}: GameContainerProps) => {
    const isActive = useSelector(isGameActive);
    return isActive ? (
        <GameComponent />
    ) : (
        <GameConnect
            minNumberOfPlayers={minNumberOfPlayers}
            maxNumberOfPlayers={maxNumberOfPlayers}
            title={title}
            GameOptionsFormComponent={GameOptionsFormComponent}
            gameOptions={gameOptions}
            setGameOptions={setGameOptions}
        />
    );
};
