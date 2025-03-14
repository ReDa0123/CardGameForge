import React, { useCallback } from 'react';
import { Typography, Button, Stack } from '@mui/material';
import { useSelector, useSendMove } from 'cardgameforge/client';
import { getTichuType, hasCalledTichu } from '../../selectors';
import { BaseDialog } from './BaseDialog';

type CallTichuDialogProps = {
    open: boolean;
};

type CallTichuPayload = {
    calledTichu: boolean;
};

export const CallTichuDialog: React.FC<CallTichuDialogProps> = ({ open }) => {
    const tichuType = useSelector(getTichuType);
    const executeTichuMove = useSendMove<CallTichuPayload>('CALL_TICHU');
    const hasAlreadyCalledTichu = useSelector(hasCalledTichu);
    const onClick = useCallback(
        (calledTichu: boolean) => {
            executeTichuMove({
                calledTichu,
            });
        },
        [executeTichuMove]
    );
    return (
        <BaseDialog open={open}>
            <Stack spacing={3} alignItems="center">
                {hasAlreadyCalledTichu ? (
                    <Typography variant="h5" component="h2" textAlign="center">
                        You have already called Tichu. Wait for the other players to call Tichu.
                    </Typography>
                ) : (
                    <>
                        <Typography variant="h5" component="h2" textAlign="center">
                            Do you want to call {tichuType}?
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => onClick(true)}
                                sx={{ minWidth: 100 }}
                            >
                                Yes
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => onClick(false)}
                                sx={{ minWidth: 100 }}
                            >
                                No
                            </Button>
                        </Stack>
                    </>
                )}
            </Stack>
        </BaseDialog>
    );
};
