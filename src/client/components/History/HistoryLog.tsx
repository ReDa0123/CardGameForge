import { getHistoryMessagesWithTimestamps } from '../../selectors/history';
import { useSelector } from 'react-redux';
import { Box, BoxProps, Stack, StackProps, Typography, TypographyProps } from '@mui/material';
import React from 'react';

type HistoryLogProps = {
    containerProps?: StackProps;
    recordProps?: BoxProps;
    textProps?: TypographyProps;
};

export const HistoryLog: React.FC<HistoryLogProps> = ({
    containerProps = {},
    recordProps = {},
    textProps = {},
}) => {
    const historyRecords = useSelector(getHistoryMessagesWithTimestamps);
    return (
        <Stack spacing={1} {...containerProps}>
            {historyRecords.map((record, index) => (
                <Box key={index} {...recordProps}>
                    <Typography {...textProps}>{record}</Typography>
                </Box>
            ))}
        </Stack>
    );
};
