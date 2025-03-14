import React, { useState } from 'react';
import { HistoryLog } from 'cardgameforge/client';
import { Box, IconButton, Typography } from '@mui/material';
import { Remove, Add } from '@mui/icons-material';

export const HistoryLogContainer: React.FC = () => {
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 16,
                right: 16,
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
                    Play History
                </Typography>
                <IconButton size="small" onClick={() => setIsMinimized(!isMinimized)}>
                    {isMinimized ? <Add /> : <Remove />}
                </IconButton>
            </Box>
            <Box
                sx={{
                    transition: 'height 0.3s ease',
                    height: isMinimized ? 0 : '400px',
                    overflow: 'hidden',
                }}
            >
                <HistoryLog />
            </Box>
        </Box>
    );
};
