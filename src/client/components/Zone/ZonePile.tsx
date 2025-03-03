import React from 'react';
import { Zone as ZoneType } from '../../types/gameObjects';
import { Card } from '../Card';
import { Box, Paper, Typography, Chip, BoxProps, ChipProps } from '@mui/material';

type ZonePileProps = {
    zone: ZoneType<any, any>;
    topCardsCount?: number;
    containerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    cardContainerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    cardCountProps?: Omit<ChipProps, 'label' | 'size' | 'color' | 'sx'> & { sx?: ChipProps['sx'] };
};

export const ZonePile: React.FC<ZonePileProps> = ({
    zone,
    topCardsCount = 3,
    containerProps,
    cardContainerProps,
    cardCountProps,
}) => {
    const cards = zone.cards;
    const cardCount = cards.length;

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

    // Determine how many cards to show (limited by topCardsCount)
    const visibleCardCount = Math.min(cardCount, topCardsCount);

    // Get the top cards from the pile
    const topCards = cards.slice(0, visibleCardCount);

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
            {...otherContainerProps}
        >
            {topCards.map((card, index) => {
                // Generate random rotation and offset for each card to create a messy pile effect
                const rotation = Math.random() * 30 - 15; // Random rotation between -15 and 15 degrees
                const offsetX = Math.random() * 20 - 10; // Random X offset between -10 and 10 pixels
                const offsetY = Math.random() * 20 - 10; // Random Y offset between -10 and 10 pixels

                // Determine if the card is face up or face down
                // For a pile, typically the top card is face up and others might be face down
                const isFaceDown = index !== topCards.length - 1;

                const { sx: cardContainerSx, ...otherCardContainerProps } =
                    cardContainerProps || {};

                return (
                    <Box
                        key={card.id}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`,
                            zIndex: index,
                            ...(cardContainerSx || {}),
                        }}
                        {...otherCardContainerProps}
                    >
                        <Card
                            cardId={card.id}
                            zoneId={zone.id}
                            isFaceDown={isFaceDown}
                            rotation={rotation}
                            offset={{ x: offsetX, y: offsetY }}
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
                        zIndex: visibleCardCount,
                        ...(cardCountSx || {}),
                    }}
                    {...otherCardCountProps}
                />
            )}
        </Box>
    );
};
