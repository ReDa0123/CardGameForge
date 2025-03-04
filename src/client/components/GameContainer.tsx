import { useSelector } from 'react-redux';
import React from 'react';
import { isGameActive } from '../selectors';
import { GameConnect } from './GameConnect';

type GameContainerProps = {
    GameComponent: React.ComponentType<any>;
    minNumberOfPlayers: number;
    maxNumberOfPlayers: number;
};

/**
 * GameContainer component that displays the game or the game connect component based on the current state of the game.
 * @param GameComponent - The component to display when the game is active
 * @param minNumberOfPlayers - The minimum number of players required to start the game
 * @param maxNumberOfPlayers - The maximum number of players allowed in the game
 */
export const GameContainer = ({
    GameComponent,
    maxNumberOfPlayers,
    minNumberOfPlayers,
}: GameContainerProps) => {
    const isActive = useSelector(isGameActive);
    return isActive ? (
        <GameComponent />
    ) : (
        <GameConnect
            minNumberOfPlayers={minNumberOfPlayers}
            maxNumberOfPlayers={maxNumberOfPlayers}
        />
    );
};
