import React, { useState } from 'react';
import { Box, Button, Paper } from '@mui/material';

interface BaseDialogProps {
    children: React.ReactNode;
    open: boolean;
}

export const BaseDialog: React.FC<BaseDialogProps> = ({ children, open }) => {
    const [hidden, setHidden] = useState(false);
    if (!open) return null;

    return (
        <>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2000,
                    pointerEvents: 'none',
                    ...(hidden ? { display: 'none' } : {}),
                }}
            >
                <Paper
                    elevation={24}
                    sx={{
                        position: 'relative',
                        minWidth: '300px',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        padding: 3,
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                        pointerEvents: 'auto',
                    }}
                >
                    {children}
                </Paper>
            </Box>
            <Button
                sx={{
                    position: 'absolute',
                    top: '32%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2000,
                    width: '250px',
                }}
                onClick={() => setHidden((prev) => !prev)}
                variant="contained"
                color={hidden ? 'primary' : 'error'}
            >
                {hidden ? 'Show dialog window' : 'Hide dialog window'}
            </Button>
        </>
    );
};
