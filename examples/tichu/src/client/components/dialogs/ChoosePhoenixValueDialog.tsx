import React, { useCallback, useState } from 'react';
import { Typography, Stack, Select, MenuItem, Box, Paper, Button } from '@mui/material';

const NUMBERS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const VALUES = {
    [NUMBERS[0]]: 2,
    [NUMBERS[1]]: 3,
    [NUMBERS[2]]: 4,
    [NUMBERS[3]]: 5,
    [NUMBERS[4]]: 6,
    [NUMBERS[5]]: 7,
    [NUMBERS[6]]: 8,
    [NUMBERS[7]]: 9,
    [NUMBERS[8]]: 10,
    [NUMBERS[9]]: 11,
    [NUMBERS[10]]: 12,
    [NUMBERS[11]]: 13,
    [NUMBERS[12]]: 14,
};

type ChoosePhoenixValueDialogProps = {
    open: boolean;
    setPhoenixValue: React.Dispatch<React.SetStateAction<number | undefined>>;
    onClose: () => void;
};

const PhoenixBaseDialog = ({ children, open }: { children: React.ReactNode; open: boolean }) => {
    if (!open) return null;

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 2999,
                }}
            />
            <Box
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 3000,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                    }}
                >
                    {children}
                </Paper>
            </Box>
        </>
    );
};

export const ChoosePhoenixValueDialog: React.FC<ChoosePhoenixValueDialogProps> = ({
    open,
    setPhoenixValue,
    onClose,
}) => {
    const [value, setValue] = useState<number>(2);
    const onClick = useCallback(
        (value: number) => {
            setPhoenixValue(value);
            onClose();
        },
        [setPhoenixValue, onClose]
    );
    return (
        <PhoenixBaseDialog open={open}>
            <Stack spacing={3} alignItems="center">
                <Typography variant="h5" component="h2" textAlign="center">
                    Select the value of the Phoenix card
                </Typography>
                <Select
                    value={value}
                    onChange={(e) => setValue(e.target.value as number)}
                    MenuProps={{
                        sx: {
                            zIndex: 3100,
                        },
                    }}
                >
                    {Object.entries(VALUES).map(([key, value]) => (
                        <MenuItem key={key} value={value}>
                            {key}
                        </MenuItem>
                    ))}
                </Select>
                <Button onClick={() => onClick(value)} variant="contained">
                    Set
                </Button>
            </Stack>
        </PhoenixBaseDialog>
    );
};
