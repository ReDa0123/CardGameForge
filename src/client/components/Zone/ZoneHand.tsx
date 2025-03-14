import React, { useMemo } from 'react';
import { Zone as ZoneType } from '../../types';
import { Card } from '../Card';
import { Box, Paper, Typography, BoxProps } from '@mui/material';
import { Card as CardType } from '../..';

type ZoneHandProps = {
    zone: ZoneType<any, any>;
    handStyle?: 'line' | 'fan';
    containerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    cardContainerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    CardProps?: any;
    CardBackProps?: any;
    onCardClick?: (cardId: string, zoneId: string) => void;
    sortFn?: (cards: CardType<any>[]) => CardType<any>[];
};

/**
 * ZoneHand component that displays a hand of cards.
 * Hand style can be 'line' or 'fan' - 'line' is a straight line of cards, 'fan' is an arc of cards.
 * By default, the hand style is 'fan'.
 * @param zone - The zone
 * @param handStyle - The style of the hand
 * @param containerProps - The props for the container
 * @param cardContainerProps - The props for the card container
 * @param CardProps - The props for the card
 * @param CardBackProps - The props for the card back
 * @param sortFn - The function to call to sort the cards - only used if styleType is 'hand'
 * @param onCardClick - The function to call when a card is clicked
 */
export const ZoneHand: React.FC<ZoneHandProps> = ({
    zone,
    handStyle = 'fan',
    containerProps,
    cardContainerProps,
    CardProps,
    CardBackProps,
    onCardClick,
    sortFn,
}) => {
    const cards = zone.cards;
    const isFanStyle = handStyle === 'fan';
    const sortedCards = useMemo(() => {
        if (sortFn) {
            return sortFn(cards);
        }
        return cards;
    }, [cards, sortFn]);

    if (cards.length === 0) {
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
                    Empty Hand
                </Typography>
            </Paper>
        );
    }

    const { sx: containerSx, ...otherContainerProps } = containerProps || {};

    return (
        <Box
            sx={{
                display: 'flex',
                position: 'relative',
                height: '200px', // Enough height for the fan effect
                minWidth: '150px',
                padding: 2,
                ...(containerSx || {}),
            }}
            {...otherContainerProps}
        >
            {sortedCards.map((card, index) => {
                // Calculate position based on handStyle
                const totalCards = cards.length;
                let rotation = 0;
                let offsetX: number;
                let offsetY = 0;

                if (isFanStyle) {
                    // Fan style: cards are arranged in an arc
                    const fanAngle = Math.min(5, 40 / totalCards);
                    rotation = (index - (totalCards - 1) / 2) * fanAngle;
                    // Calculate position based on the arc
                    const multiplier =
                        cards.length > 7
                            ? 75
                            : cards.length > 5
                            ? 100
                            : cards.length > 3
                            ? 175
                            : 250;
                    const radius = cards.length * multiplier;
                    const angleInRadians = (rotation * Math.PI) / 180;
                    offsetX = Math.sin(angleInRadians) * radius;
                    offsetY = -1 * ((1 - Math.cos(angleInRadians)) * radius);
                } else {
                    // Line style: cards are arranged in a straight line with overlap
                    const overlap = 60;
                    offsetX = index * overlap;
                }

                const { sx: cardContainerSx, ...otherCardContainerProps } =
                    cardContainerProps || {};

                return (
                    <Box
                        key={card.id}
                        sx={{
                            position: 'absolute',
                            left: isFanStyle ? `calc(50% - 60px + ${offsetX}px)` : `${offsetX}px`,
                            bottom: isFanStyle ? `${offsetY}px` : 0,
                            transformOrigin: isFanStyle ? 'bottom center' : 'center',
                            zIndex: index,
                            transform: isFanStyle ? `rotate(${rotation}deg)` : 'none',
                            '&:hover': onCardClick
                                ? {
                                      zIndex: 1000,
                                      transform: isFanStyle
                                          ? `rotate(${rotation}deg) translateY(-20px) scale(1.1)`
                                          : 'translateY(-10px) scale(1.1)',
                                      cursor: 'pointer',
                                  }
                                : undefined,
                            transition: 'all 0.2s ease-in-out',
                            ...(cardContainerSx || {}),
                        }}
                        {...otherCardContainerProps}
                    >
                        <Card
                            cardId={card.id}
                            zoneId={zone.id}
                            CardProps={CardProps}
                            CardBackProps={CardBackProps}
                            onClick={onCardClick}
                        />
                    </Box>
                );
            })}
        </Box>
    );
};
