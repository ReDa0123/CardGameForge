import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Remove, Add } from '@mui/icons-material';
import { getCalledTichus, getNumberOfPasses, getTeamScoresWithTeamNames } from '../selectors';
import { getNetworkInfo, useSelector } from 'cardgameforge/client';

export const GameOverview: React.FC = () => {
    const [isMinimized, setIsMinimized] = useState(false);
    const calledTichus = useSelector(getCalledTichus);
    const numberOfPasses = useSelector(getNumberOfPasses);
    const teamScores = useSelector(getTeamScoresWithTeamNames);
    const networkState = useSelector(getNetworkInfo);

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                width: '300px',
                backgroundColor: 'background.paper',
                borderRadius: 1,
                boxShadow: 2,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                <Typography variant="h6" pl={1}>
                    Game Overview
                </Typography>
                <IconButton size="small" onClick={() => setIsMinimized(!isMinimized)}>
                    {isMinimized ? <Add /> : <Remove />}
                </IconButton>
            </Box>
            <Box
                sx={{
                    transition: 'height 0.3s ease',
                    height: isMinimized ? 0 : undefined,
                    overflow: 'hidden',
                    paddingInline: 2,
                    paddingBottom: 2,
                    padding: isMinimized ? 0 : undefined,
                }}
            >
                <Typography variant="h5" paddingBlock={1}>
                    Called Tichus
                </Typography>
                {Object.entries(calledTichus).map(([playerId, calledTichu]) => (
                    <Typography variant="h6" key={playerId}>
                        {
                            networkState.players?.find((player) => player.playerId === playerId)
                                ?.playerNickname
                        }
                        :{' '}
                        {calledTichu === 'BIG'
                            ? 'Grand Tichu'
                            : calledTichu === 'SMALL'
                            ? 'Small Tichu'
                            : 'No Tichu'}
                    </Typography>
                ))}
                <Typography variant="h5" paddingBlock={1}>
                    Number of Passes
                </Typography>
                <Typography variant="h6">{numberOfPasses}</Typography>
                <Typography variant="h5" paddingBlock={1}>
                    Team Scores
                </Typography>
                {teamScores.map((score) => (
                    <Typography variant="h6" key={score.teamId}>
                        {score.teamName}: {score.score}
                    </Typography>
                ))}
            </Box>
        </Box>
    );
};
