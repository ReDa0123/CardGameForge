import React, { useCallback } from 'react';
import { Typography, Button, Stack } from '@mui/material';
import {
    useSelector,
    useSendMove,
    getSelectedCardsInZone,
    SelectedCards,
    useDispatch,
    unselectZone,
    areYouActivePlayer,
    useNotification,
    unselectCard,
} from 'cardgameforge/client';
import { BaseDialog } from './BaseDialog';
import { getPlayedCombinationInfo } from '../../selectors';

type SelectedCardsToPlayDialogProps = {
    open: boolean;
    yourHandId: string;
    phoenixValue: number | undefined;
    setPhoenixValue: React.Dispatch<React.SetStateAction<number | undefined>>;
};

type PlayCardsPayload = {
    cardIds: string[];
    phoenixValue?: number;
};

type PassPayload = {};

const CurrentCombination = ({ currentCombination, cardsInCombination, playedBy }: any) => {
    if (!currentCombination) {
        return null;
    }
    return (
        <>
            <Typography variant="h6" mt="4px !important">
                Current combination: {currentCombination}
            </Typography>
            <Typography variant="h6" mt="4px !important">
                Last played cards in that combination: {cardsInCombination.join(', ')}
            </Typography>
            <Typography variant="h6" mt="4px !important">
                Played by: {playedBy}
            </Typography>
        </>
    );
};

export const SelectedCardsToPlayDialog: React.FC<SelectedCardsToPlayDialogProps> = ({
    open,
    yourHandId,
    phoenixValue,
    setPhoenixValue,
}) => {
    const dispatch = useDispatch();
    const executePlayCardsMove = useSendMove<PlayCardsPayload>('PLAY_CARDS');
    const executePassMove = useSendMove<PassPayload>('PASS');
    const isOnPlay = useSelector(areYouActivePlayer);
    const { currentCombination, cardsInCombination, playedBy } =
        useSelector(getPlayedCombinationInfo);
    const notify = useNotification();
    const selectedCards = useSelector(getSelectedCardsInZone(yourHandId));
    const onSendClick = useCallback(() => {
        if (selectedCards.length === 0) {
            notify('You must select cards to play');
            return;
        }
        executePlayCardsMove({
            cardIds: selectedCards,
            phoenixValue,
        });
        if (phoenixValue) {
            setPhoenixValue(undefined);
        }
        dispatch(unselectZone(yourHandId));
    }, [executePlayCardsMove, selectedCards, yourHandId, dispatch]);
    const onPassClick = useCallback(() => {
        executePassMove({});
        dispatch(unselectZone(yourHandId));
    }, [executePassMove, yourHandId, dispatch]);
    const handleCardClick = (cardId: string, cardZoneId: string) => {
        const isPhoenix = cardId.includes('PHOENIX');
        if (isPhoenix) {
            setPhoenixValue(undefined);
        }
        dispatch(unselectCard({ cardId, zoneId: cardZoneId }));
    };

    return (
        <BaseDialog open={open}>
            <Stack spacing={3} alignItems="center">
                {!isOnPlay ? (
                    <>
                        <Typography variant="h5" component="h2" textAlign="center">
                            Wait for your turn
                        </Typography>
                        <CurrentCombination
                            currentCombination={currentCombination}
                            cardsInCombination={cardsInCombination}
                            playedBy={playedBy}
                        />
                    </>
                ) : (
                    <>
                        <Typography variant="h5" component="h2" textAlign="center">
                            Play your cards
                        </Typography>
                        <SelectedCards zoneId={yourHandId} onCardClick={handleCardClick} />
                        <CurrentCombination
                            currentCombination={currentCombination}
                            cardsInCombination={cardsInCombination}
                            playedBy={playedBy}
                        />
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onSendClick}
                                sx={{ minWidth: 100 }}
                            >
                                Play Cards
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onPassClick}
                                sx={{ minWidth: 100 }}
                            >
                                Pass
                            </Button>
                        </Stack>
                    </>
                )}
            </Stack>
        </BaseDialog>
    );
};
