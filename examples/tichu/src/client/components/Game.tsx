import React, { useCallback, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Zone } from 'cardgameforge/client/components';
import {
    selectCard,
    unselectCard,
    useDispatch,
    useSelector,
    getSelectedCardsInZone,
    areYouActivePlayer,
    getPhase,
    useNotification,
    Card,
    getEndGameResult,
} from 'cardgameforge/client';
import {
    getCollectedPileIds,
    getHandIds,
    getOtherPlayersInfo,
    hasSentCards,
    getTeamScoresWithTeamNames,
    getPlayedCombination,
} from '../selectors';
import { CallTichuDialog } from './dialogs/CallTichuDialog';
import { TichuCard } from 'src/server/types';
import { SendCardsDialog } from './dialogs/SendCardsDialog';
import { SelectedCardsToPlayDialog } from './dialogs/SelectedCardsToPlayDialog';
import { SendDeckDialog } from './dialogs/SendDeckDialog';
import { HistoryLogContainer } from './HistoryLogContainer';
import { GameOverview } from './GameOverview';
import { ChoosePhoenixValueDialog } from './dialogs/ChoosePhoenixValueDialog';

const useOnCardClick = (
    yourHandId: string,
    currentPhase: string,
    setPhoenixValue: React.Dispatch<React.SetStateAction<number | undefined>>,
    setChoosePhoenixValueDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
    phoenixValue: number | undefined
) => {
    const isActive = useSelector(areYouActivePlayer);
    const selectedCardsInHand = useSelector(getSelectedCardsInZone(yourHandId));
    const hasSentCardsAlready = useSelector(hasSentCards);
    const dispatch = useDispatch();
    const notify = useNotification();
    const currentCombination = useSelector(getPlayedCombination);
    const sendCardsHandler = useCallback(
        (cardId: string, zoneId: string) => {
            if (selectedCardsInHand.includes(cardId)) {
                dispatch(unselectCard({ cardId, zoneId }));
            } else {
                if (selectedCardsInHand.length >= 3) {
                    notify('You can only select 3 cards at a time');
                    return;
                }
                dispatch(selectCard({ cardId, zoneId }));
            }
        },
        [dispatch, selectedCardsInHand]
    );
    const playCardsHandler = useCallback(
        (cardId: string, zoneId: string) => {
            const isPhoenix = cardId.includes('PHOENIX');
            if (selectedCardsInHand.includes(cardId)) {
                if (isPhoenix) {
                    setPhoenixValue(undefined);
                }
                dispatch(unselectCard({ cardId, zoneId }));
            } else {
                if (isPhoenix) {
                    if (
                        selectedCardsInHand.length === 0 &&
                        (!currentCombination.type || currentCombination.type === 'SINGLE')
                    ) {
                        setPhoenixValue(
                            (currentCombination.cards[0]?.templateFields.custom!.value ?? 0) + 0.5
                        );
                        dispatch(selectCard({ cardId, zoneId }));
                    } else {
                        setChoosePhoenixValueDialogOpen(true);
                    }
                } else {
                    if (phoenixValue && (phoenixValue * 10) % 10 === 5) {
                        setPhoenixValue(undefined);
                        dispatch(
                            unselectCard({
                                cardId: 'PHOENIX_0',
                                zoneId: yourHandId,
                            })
                        );
                        notify('Phoenix card value reset');
                    }
                    dispatch(selectCard({ cardId, zoneId }));
                }
            }
        },
        [dispatch, selectedCardsInHand]
    );
    if (!isActive) {
        return undefined;
    }
    if (currentPhase === 'SEND_CARDS') {
        if (hasSentCardsAlready) {
            return undefined;
        }
        return sendCardsHandler;
    }
    if (currentPhase === 'PLAY_CARDS') {
        return playCardsHandler;
    }
    return undefined;
};
export const Game: React.FC = () => {
    const [phoenixValue, setPhoenixValue] = useState<number | undefined>(undefined);
    const [choosePhoenixValueDialogOpen, setChoosePhoenixValueDialogOpen] =
        useState<boolean>(false);

    const { yourHandId, leftPlayerHandId, teammateHandId, rightPlayerHandId } =
        useSelector(getHandIds);
    const {
        yourCollectedPileId,
        leftPlayerCollectedPileId,
        teammateCollectedPileId,
        rightPlayerCollectedPileId,
    } = useSelector(getCollectedPileIds);
    const { leftPlayerNickname, rightPlayerNickname, teammateNickname } =
        useSelector(getOtherPlayersInfo);
    const currentPhase = useSelector(getPhase);
    const endGameResult = useSelector(getEndGameResult);
    const teamScores = useSelector(getTeamScoresWithTeamNames);
    const dispatch = useDispatch();

    const onCardClick = useOnCardClick(
        yourHandId,
        currentPhase,
        setPhoenixValue,
        setChoosePhoenixValueDialogOpen,
        phoenixValue
    );
    const sortFn = useCallback((cards: Card<TichuCard>[]) => {
        return [...cards].sort((a, b) => {
            const valueA = a.templateFields.custom!.value ?? 0;
            const valueB = b.templateFields.custom!.value ?? 0;
            return valueA - valueB;
        });
    }, []);

    if (endGameResult) {
        return (
            <Box
                sx={{
                    width: '100vw',
                    height: '100vh',
                    position: 'relative',
                    bgcolor: 'secondary.light',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h6">Game over!</Typography>
                <Typography variant="h6">{endGameResult.reason}</Typography>
                <Typography variant="h6">Final scores:</Typography>
                {teamScores.map((score) => (
                    <Typography variant="h6" key={score.teamId}>
                        {score.teamName}: {score.score}
                    </Typography>
                ))}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                position: 'relative',
                bgcolor: 'secondary.light',
                overflow: 'hidden',
            }}
        >
            {/* Center deck and played cards */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    gap: 4,
                }}
            >
                <Zone
                    zoneId="START_DECK"
                    styleType="deck"
                    topCardsCount={5}
                    CardBackProps={{ children: <Typography p={2}>Tichu</Typography> }}
                />
                <Zone zoneId="PLAYED_CARDS" styleType="pile" topCardsCount={5} />
            </Box>

            {/* Your hand */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: 'center',
                    }}
                >
                    Your hand
                </Typography>
                <Zone
                    zoneId={yourHandId}
                    styleType="hand"
                    handStyle="fan"
                    onCardClick={onCardClick}
                    sortFn={sortFn}
                />
            </Box>

            {/* Your collected pile */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 125,
                    left: '80%',
                    transform: 'translateX(-50%)',
                }}
            >
                <Zone zoneId={yourCollectedPileId} styleType="pile" topCardsCount={5} />
            </Box>

            {/* Left player's hand (rotated) */}
            <Box
                sx={{
                    position: 'absolute',
                    left: 20,
                    top: '50%',
                    transform: 'translateY(-50%) rotate(90deg)',
                }}
            >
                <Typography variant="h6">{leftPlayerNickname}</Typography>
                <Zone
                    zoneId={leftPlayerHandId}
                    styleType="hand"
                    handStyle="fan"
                    CardBackProps={{ children: <Typography p={2}>Tichu</Typography> }}
                />
            </Box>
            {/* Left player's collected pile */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 125,
                    left: '18%',
                    transform: 'translateX(-50%) rotate(90deg)',
                }}
            >
                <Zone zoneId={leftPlayerCollectedPileId} styleType="pile" topCardsCount={5} />
            </Box>

            {/* Right player's hand (rotated) */}
            <Box
                sx={{
                    position: 'absolute',
                    right: 20,
                    top: '50%',
                    transform: 'translateY(-50%) rotate(-90deg)',
                }}
            >
                <Typography variant="h6">{rightPlayerNickname}</Typography>
                <Zone
                    zoneId={rightPlayerHandId}
                    styleType="hand"
                    handStyle="fan"
                    CardBackProps={{ children: <Typography p={2}>Tichu</Typography> }}
                />
            </Box>
            {/* Right player's collected pile */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 125,
                    left: '80%',
                    transform: 'translateX(-50%) rotate(-90deg)',
                }}
            >
                <Zone zoneId={rightPlayerCollectedPileId} styleType="pile" topCardsCount={5} />
            </Box>

            {/* Teammate's hand */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -20,
                    left: '50%',
                    transform: 'translateX(-50%) rotate(180deg)',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: 'center',
                        transform: 'rotate(180deg)',
                    }}
                >
                    Teammate's hand
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        transform: 'rotate(180deg)',
                        textAlign: 'center',
                    }}
                >
                    {teammateNickname}
                </Typography>
                <Zone
                    zoneId={teammateHandId}
                    styleType="hand"
                    handStyle="fan"
                    CardBackProps={{ children: <Typography p={2}>Tichu</Typography> }}
                />
            </Box>
            {/* Teammate's collected pile */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 125,
                    left: '18%',
                    transform: 'translateX(-50%) rotate(180deg)',
                }}
            >
                <Zone zoneId={teammateCollectedPileId} styleType="pile" topCardsCount={5} />
            </Box>

            {/* Dialogs */}
            {(currentPhase === 'SMALL_TICHU' || currentPhase === 'BIG_TICHU') && (
                <CallTichuDialog open={true} />
            )}
            {currentPhase === 'SEND_CARDS' && (
                <SendCardsDialog open={true} yourHandId={yourHandId} />
            )}
            {currentPhase === 'PLAY_CARDS' && (
                <>
                    <SelectedCardsToPlayDialog
                        open={true}
                        yourHandId={yourHandId}
                        phoenixValue={phoenixValue}
                        setPhoenixValue={setPhoenixValue}
                    />
                    <ChoosePhoenixValueDialog
                        open={choosePhoenixValueDialogOpen}
                        setPhoenixValue={setPhoenixValue}
                        onClose={() => {
                            setChoosePhoenixValueDialogOpen(false);
                            dispatch(selectCard({ cardId: 'PHOENIX_0', zoneId: yourHandId }));
                        }}
                    />
                </>
            )}
            {currentPhase === 'SEND_DECK' && <SendDeckDialog open={true} />}

            {/* History log */}
            <HistoryLogContainer />

            {/* Game overview */}
            <GameOverview />
        </Box>
    );
};
