import { getHistoryMessagesWithTimestamps } from '../../selectors';
import { useSelector } from 'react-redux';
import {
    Box,
    Stack,
    StackProps,
    Typography,
    TypographyProps,
    Paper,
    PaperProps,
} from '@mui/material';
import React, { useEffect, useRef } from 'react';

type HistoryLogProps = {
    containerProps?: StackProps;
    recordProps?: PaperProps;
    textProps?: TypographyProps;
};

/**
 * HistoryLog component that displays the history of the game.
 * @param containerProps - The props for the container.
 * @param recordProps - The props for the record.
 * @param textProps - The props for the text.
 */
export const HistoryLog: React.FC<HistoryLogProps> = ({
    containerProps = {},
    recordProps = {},
    textProps = {},
}) => {
    const historyRecords = useSelector(getHistoryMessagesWithTimestamps);
    const stackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (stackRef.current) {
            stackRef.current.scrollTop = stackRef.current.scrollHeight;
        }
    }, [historyRecords]);

    return (
        <Stack
            ref={stackRef}
            spacing={1}
            sx={{
                p: 2,
                height: '100%',
                width: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '4px',
                    '&:hover': {
                        background: '#555',
                    },
                },
                ...containerProps.sx,
            }}
            {...containerProps}
        >
            {historyRecords.map((record, index) => {
                const [timestamp, message] = record.split(' - ');
                return (
                    <Paper
                        key={index}
                        elevation={0}
                        sx={{
                            p: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.03)',
                            borderRadius: 1,
                            width: '100%',
                            ...recordProps.sx,
                        }}
                        {...recordProps}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'text.primary',
                                    ...textProps.sx,
                                }}
                                {...textProps}
                            >
                                {timestamp}
                            </Typography>
                            <Typography
                                sx={{
                                    flex: 1,
                                    wordBreak: 'break-word',
                                    ...textProps.sx,
                                }}
                                {...textProps}
                            >
                                {message}
                            </Typography>
                        </Box>
                    </Paper>
                );
            })}
        </Stack>
    );
};
