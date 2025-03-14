import React, { useCallback } from 'react';
import { Typography, Button, Stack } from '@mui/material';
import {
    useSelector,
    useSendMove,
    useNotification,
    getSelectedCardsInZone,
    SelectedCards,
    useDispatch,
    unselectZone,
} from 'cardgameforge/client';
import { hasSentCards } from '../../selectors';
import { BaseDialog } from './BaseDialog';

type SendCardsDialogProps = {
    open: boolean;
    yourHandId: string;
};

type SendCardsPayload = {
    sentCardIds: string[];
};

export const SendCardsDialog: React.FC<SendCardsDialogProps> = ({ open, yourHandId }) => {
    const dispatch = useDispatch();
    const executeSendCardsMove = useSendMove<SendCardsPayload>('SEND_CARDS');
    const notify = useNotification();
    const hasAlreadySentCards = useSelector(hasSentCards);
    const selectedCards = useSelector(getSelectedCardsInZone(yourHandId));
    const onClick = useCallback(() => {
        if (selectedCards.length !== 3) {
            notify('You must select 3 cards to send');
            return;
        }
        executeSendCardsMove({
            sentCardIds: selectedCards,
        });
        dispatch(unselectZone(yourHandId));
    }, [executeSendCardsMove, selectedCards, yourHandId, dispatch]);

    return (
        <BaseDialog open={open}>
            <Stack spacing={3} alignItems="center">
                {hasAlreadySentCards ? (
                    <Typography variant="h5" component="h2" textAlign="center">
                        You have already sent cards. Wait for the other players to send cards.
                    </Typography>
                ) : (
                    <>
                        <Typography variant="h5" component="h2" textAlign="center">
                            Send 3 cards to the other players.
                        </Typography>
                        <Typography variant="body2">
                            The left card will be sent to the player to the left, the middle card
                            will be sent to your teammate, and the right card will be sent to the
                            player to the right.
                        </Typography>
                        <SelectedCards zoneId={yourHandId} />
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onClick}
                                sx={{ minWidth: 100 }}
                            >
                                Send Cards
                            </Button>
                        </Stack>
                    </>
                )}
            </Stack>
        </BaseDialog>
    );
};
