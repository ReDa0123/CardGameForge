import { useSelector } from 'react-redux';
import { isInLobby } from '../../selectors';
import { GameFinder } from './GameFinder';
import React from 'react';
import { GameLobby } from './GameLobby';

type GameConnectProps = {
    minNumberOfPlayers: number;
    maxNumberOfPlayers: number;
};

/**
 * GameConnect component that displays the game lobby or the game finder based on the current state of the game.
 * @param minNumberOfPlayers - The minimum number of players required to start the game.
 * @param maxNumberOfPlayers - The maximum number of players allowed in the game.
 */
export const GameConnect: React.FC<GameConnectProps> = ({
    minNumberOfPlayers,
    maxNumberOfPlayers,
}) => {
    const inLobby = useSelector(isInLobby);
    return inLobby ? (
        <GameLobby
            minNumberOfPlayers={minNumberOfPlayers}
            maxNumberOfPlayers={maxNumberOfPlayers}
        />
    ) : (
        <GameFinder />
    );
};
