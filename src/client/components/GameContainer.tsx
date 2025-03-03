import { useSelector } from 'react-redux';
import React from 'react';
import { isGameActive } from '../selectors/isGameActive';
import { GameConnect } from './GameConnect/GameConnect';

type GameContainerProps = {
    GameComponent: React.ComponentType<any>;
    minNumberOfPlayers: number;
    maxNumberOfPlayers: number;
};

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
