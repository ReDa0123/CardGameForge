import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedCardsInZone, getZoneById } from '../../selectors';
import { Card } from '../Card';
import { Box, Typography, Paper, BoxProps, PaperProps, TypographyProps } from '@mui/material';
import { unselectCard } from '../../context';

type SelectedCardsProps = {
    zoneId: string;
    title?: string;
    onCardClick?: (cardId: string, zoneId: string) => void;
    containerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    cardContainerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    paperProps?: Omit<PaperProps, 'sx'> & { sx?: PaperProps['sx'] };
    titleProps?: Omit<TypographyProps, 'sx'> & { sx?: TypographyProps['sx'] };
};

/**
 * SelectedCards component that displays the selected cards in a zone.
 * By defualt, the onClick event will unselect the card.
 * @param zoneId - The id of the zone
 * @param title - The title of the selected cards
 * @param onCardClick - The function to call when a card is clicked
 * @param containerProps - The props for the container
 * @param cardContainerProps - The props for the card container
 * @param paperProps - The props for the paper
 * @param titleProps - The props for the title
 */
export const SelectedCards: React.FC<SelectedCardsProps> = ({
    zoneId,
    title = 'Selected Cards',
    onCardClick,
    containerProps,
    cardContainerProps,
    paperProps,
    titleProps,
}) => {
    const dispatch = useDispatch();
    const selectedCardIds = useSelector(getSelectedCardsInZone(zoneId));
    const zone = useSelector(getZoneById(zoneId));

    // If there are no selected cards or the zone doesn't exist, don't render anything
    if (!selectedCardIds || selectedCardIds.length === 0 || !zone) {
        return null;
    }

    const handleCardClick = (cardId: string, cardZoneId: string) => {
        if (onCardClick) {
            onCardClick(cardId, cardZoneId);
        } else {
            // Default behavior: unselect the card
            dispatch(unselectCard({ cardId, zoneId: cardZoneId }));
        }
    };

    const { sx: containerSx, ...otherContainerProps } = containerProps || {};
    const { sx: paperSx, ...otherPaperProps } = paperProps || {};
    const { sx: titleSx, ...otherTitleProps } = titleProps || {};

    return (
        <Box sx={{ mb: 2, ...(containerSx || {}) }} {...otherContainerProps}>
            <Typography variant="h6" sx={{ mb: 1, ...(titleSx || {}) }} {...otherTitleProps}>
                {title}
            </Typography>
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                    borderRadius: 2,
                    overflowX: 'auto',
                    ...(paperSx || {}),
                }}
                {...otherPaperProps}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        minHeight: '180px',
                    }}
                >
                    {selectedCardIds.map((cardId: string, index: number) => {
                        if (!zone.cards.find((c) => c.id === cardId)) {
                            return null;
                        }

                        const { sx: cardContainerSx, ...otherCardContainerProps } =
                            cardContainerProps || {};

                        return (
                            <Box
                                key={cardId}
                                sx={{
                                    position: 'relative',
                                    marginLeft: index === 0 ? 0 : '-40px', // Overlap cards
                                    zIndex: index,
                                    ...(cardContainerSx || {}),
                                }}
                                {...otherCardContainerProps}
                            >
                                <Card cardId={cardId} zoneId={zoneId} onClick={handleCardClick} />
                            </Box>
                        );
                    })}
                </Box>
            </Paper>
        </Box>
    );
};
