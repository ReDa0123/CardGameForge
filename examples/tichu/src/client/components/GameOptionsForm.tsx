import React from 'react';
import { TichuGameSettings } from 'src/server/types';
import { FormControl, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { getPlayerIds, getYourPlayerId } from 'cardgameforge/client';

type GameOptionsFormProps = {
    gameOptions: TichuGameSettings;
    setGameOptions: React.Dispatch<React.SetStateAction<TichuGameSettings>>;
};

export const GameOptionsForm: React.FC<GameOptionsFormProps> = ({
    gameOptions,
    setGameOptions,
}) => {
    const playerIds = useSelector(getPlayerIds);
    const yourPlayerId = useSelector(getYourPlayerId);
    return (
        <FormControl>
            <TextField
                label="Score to Win"
                type="number"
                value={gameOptions.scoreToWin}
                onChange={(e) => {
                    const newValue = Number(e.target.value);
                    const scoreToWin = isNaN(newValue) || newValue < 0 ? 0 : newValue;
                    setGameOptions({ ...gameOptions, scoreToWin });
                }}
                disabled={playerIds[0] !== yourPlayerId}
            />
        </FormControl>
    );
};
