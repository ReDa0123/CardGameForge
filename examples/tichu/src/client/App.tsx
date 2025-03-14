import React, { useState } from 'react';
import { DisplayRegistry, GameContainer, GameContextProvider } from 'cardgameforge/client';
import { TichuGameSettings } from 'src/server/types';
import { GameOptionsForm } from './components/GameOptionsForm';
import { Card } from './components/Card';
import { Game } from './components/Game';

const displayRegistry: DisplayRegistry = {
    default: Card,
};

// TODO: Get address from environment variable
const serverAddress = 'http://localhost:3000';

function App() {
    const [gameOptions, setGameOptions] = useState<TichuGameSettings>({
        scoreToWin: 500,
    });
    return (
        <GameContextProvider displayRegistry={displayRegistry} serverAddress={serverAddress}>
            <GameContainer
                GameComponent={Game}
                minNumberOfPlayers={4}
                maxNumberOfPlayers={4}
                title="Tichu"
                GameOptionsFormComponent={GameOptionsForm}
                gameOptions={gameOptions}
                setGameOptions={setGameOptions}
            />
        </GameContextProvider>
    );
}

export default App;
