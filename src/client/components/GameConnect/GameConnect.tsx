import { useSelector } from 'react-redux';
import { isInLobby } from '../../selectors/isInLobby';
import { GameFinder } from './GameFinder';
import React from 'react';
import { GameLobby } from './GameLobby';

type GameConnectProps = {
    minNumberOfPlayers: number;
    maxNumberOfPlayers: number;
};

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
