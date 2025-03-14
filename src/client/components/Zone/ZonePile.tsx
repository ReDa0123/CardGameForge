import React, { useMemo, useRef } from 'react';
import { Zone as ZoneType } from '../../types';
import { Card } from '../Card';
import { Box, Paper, Typography, Chip, BoxProps, ChipProps } from '@mui/material';

type ZonePileProps = {
    zone: ZoneType<any, any>;
    topCardsCount?: number;
    containerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    cardContainerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    cardCountProps?: Omit<ChipProps, 'label' | 'size' | 'color' | 'sx'> & { sx?: ChipProps['sx'] };
    CardProps?: any;
    CardBackProps?: any;
    onPileClick?: (zoneId: string) => void;
    allFaceDown?: boolean;
};

/**
 * ZonePile component that displays a pile of cards.
 * By default, the topCardsCount is 3.
 * @param zone - The zone
 * @param topCardsCount - The number of top cards to display
 * @param containerProps - The props for the container
 * @param cardContainerProps - The props for the card container
 * @param cardCountProps - The props for the card count
 * @param CardProps - The props for the card
 * @param CardBackProps - The props for the card back
 * @param onPileClick - The function to call when the pile is clicked
 * @param allFaceDown - Whether all cards should be face down
 */
export const ZonePile: React.FC<ZonePileProps> = ({
    zone,
    topCardsCount = 3,
    containerProps,
    cardContainerProps,
    cardCountProps,
    CardProps,
    CardBackProps,
    onPileClick,
    allFaceDown = false,
}) => {
    const cards = useMemo(() => zone.cards, [zone.cards]);
    const cardCount = cards.length;

    // Store random positions in a ref to keep them stable across renders
    const positionsRef = useRef<
        Map<string, { rotation: number; offsetX: number; offsetY: number }>
    >(new Map());

    // Memoize the top cards and use stable random positions
    const memoizedTopCards = useMemo(() => {
        const visibleCardCount = Math.min(cardCount, topCardsCount);
        const topCards = cards.slice(-visibleCardCount);

        // Clear positions for cards that are no longer in the top cards
        const currentCardIds = new Set(topCards.map((card) => card.id));
        Array.from(positionsRef.current.keys()).forEach((cardId) => {
            if (!currentCardIds.has(cardId)) {
                positionsRef.current.delete(cardId);
            }
        });

        return topCards.map((card) => {
            // Reuse existing position or generate new one
            if (!positionsRef.current.has(card.id)) {
                positionsRef.current.set(card.id, {
                    rotation: Math.random() * 90 - 45,
                    offsetX: Math.random() * 40 - 20,
                    offsetY: Math.random() * 40 - 20,
                });
            }

            return {
                card,
                position: positionsRef.current.get(card.id)!,
            };
        });
    }, [cards, cardCount, topCardsCount]);

    if (cardCount === 0) {
        return (
            <Paper
                elevation={1}
                sx={{
                    width: '120px',
                    height: '168px',
                    border: '1px dashed #ccc',
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#999',
                    ...(containerProps?.sx || {}),
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    Empty Pile
                </Typography>
            </Paper>
        );
    }

    const { sx: containerSx, ...otherContainerProps } = containerProps || {};
    const { sx: cardCountSx, ...otherCardCountProps } = cardCountProps || {};

    return (
        <Box
            sx={{
                position: 'relative',
                width: '150px',
                height: '200px',
                ...(containerSx || {}),
            }}
            onClick={() => onPileClick?.(zone.id)}
            {...otherContainerProps}
        >
            {memoizedTopCards.map(({ card, position }, index) => {
                const isFaceDown = allFaceDown;
                const { sx: cardContainerSx, ...otherCardContainerProps } =
                    cardContainerProps || {};

                return (
                    <Box
                        key={card.id}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) translate(${position.offsetX}px, ${position.offsetY}px) rotate(${position.rotation}deg)`,
                            zIndex: index,
                            ...(cardContainerSx || {}),
                        }}
                        {...otherCardContainerProps}
                    >
                        <Card
                            cardId={card.id}
                            zoneId={zone.id}
                            isFaceDown={isFaceDown}
                            CardProps={CardProps}
                            CardBackProps={CardBackProps}
                        />
                    </Box>
                );
            })}

            {/* Card count indicator */}
            {cardCount > topCardsCount && (
                <Chip
                    label={`+${cardCount - topCardsCount} more`}
                    size="small"
                    color="primary"
                    sx={{
                        position: 'absolute',
                        bottom: '5px',
                        right: '5px',
                        zIndex: memoizedTopCards.length,
                        ...(cardCountSx || {}),
                    }}
                    {...otherCardCountProps}
                />
            )}
        </Box>
    );
};
