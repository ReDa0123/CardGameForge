import React, { useCallback } from 'react';
import { Typography, Button, Stack } from '@mui/material';
import { areYouActivePlayer, useSelector, useSendMove } from 'cardgameforge/client';
import { getOtherPlayersInfo } from '../../selectors';
import { BaseDialog } from './BaseDialog';

type SendDeckDialogProps = {
    open: boolean;
};

type SendDeckPayload = {
    playerId: string;
};

export const SendDeckDialog: React.FC<SendDeckDialogProps> = ({ open }) => {
    const executeSendDeckMove = useSendMove<SendDeckPayload>('SEND_DECK');
    const onClick = useCallback(
        (playerId: string) => {
            executeSendDeckMove({
                playerId,
            });
        },
        [executeSendDeckMove]
    );
    const isOnPlay = useSelector(areYouActivePlayer);
    const { leftPlayerId, rightPlayerId } = useSelector(getOtherPlayersInfo);

    return (
        <BaseDialog open={open}>
            <Stack spacing={3} alignItems="center">
                {isOnPlay ? (
                    <>
                        <Typography variant="h5" component="h2" textAlign="center">
                            Send the deck with DRAGON to one of your opponents.
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => onClick(leftPlayerId)}
                                sx={{ minWidth: 100 }}
                            >
                                Send Deck Left
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => onClick(rightPlayerId)}
                                sx={{ minWidth: 100 }}
                            >
                                Send Deck Right
                            </Button>
                        </Stack>
                    </>
                ) : (
                    <Typography variant="h5" component="h2" textAlign="center">
                        Wait for the other players to send the deck with DRAGON.
                    </Typography>
                )}
            </Stack>
        </BaseDialog>
    );
};
