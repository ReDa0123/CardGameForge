import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Zone as ZoneType, Card as CardType } from '../../types';
import { Card } from '../Card';
import { Box, Paper, Typography, BoxProps } from '@mui/material';

type ZoneHandProps = {
    zone: ZoneType<any, any>;
    handStyle?: 'line' | 'fan';
    containerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    cardContainerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    CardProps?: any;
    CardBackProps?: any;
    onCardClick?: (cardId: string, zoneId: string) => void;
    sortFn?: (cards: CardType<any>[]) => CardType<any>[];
    hoverStyle?: 'over' | 'overDelay' | 'none';
    disableHoverAnimation?: boolean;
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
 * @param hoverStyle - The style to apply when the card is hovered. Over increases the z index over the other cards in hand.
 * overDelay does the same after two-second delay. None does not increase the z index.
 * @param disableHoverAnimation - Whether to disable the hover animation
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
    hoverStyle,
    disableHoverAnimation,
}) => {
    const cards = zone.cards as CardType<any>[];
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
            {sortedCards.map((card, index) => (
                <HandCard
                    key={card.id}
                    cardId={card.id}
                    totalCards={cards.length}
                    index={index}
                    hoverStyle={hoverStyle}
                    disableHoverAnimation={disableHoverAnimation}
                    isFanStyle={isFanStyle}
                    cardContainerProps={cardContainerProps}
                    zoneId={zone.id}
                    CardProps={CardProps}
                    CardBackProps={CardBackProps}
                    onCardClick={onCardClick}
                />
            ))}
        </Box>
    );
};

type HandCardProps = {
    cardId: string;
    totalCards: number;
    index: number;
    hoverStyle?: 'over' | 'overDelay' | 'none';
    disableHoverAnimation?: boolean;
    isFanStyle: boolean;
    cardContainerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    zoneId: string;
    CardProps?: any;
    CardBackProps?: any;
    onCardClick?: (cardId: string, zoneId: string) => void;
};

const HandCard = ({
    cardId,
    totalCards,
    index,
    hoverStyle = 'over',
    disableHoverAnimation = false,
    isFanStyle,
    cardContainerProps,
    zoneId,
    CardProps,
    CardBackProps,
    onCardClick,
}: HandCardProps) => {
    // Hover delay and zIndex handling
    const [zIndexHover, setZIndexHover] = useState<number | undefined>(undefined);
    const timeoutRef = useRef<number | undefined>(undefined);
    const handleMouseEnter = useCallback(() => {
        if (hoverStyle === 'overDelay' && !disableHoverAnimation) {
            timeoutRef.current = window.setTimeout(() => {
                setZIndexHover(1000);
            }, 2000);
        } else if (hoverStyle === 'over') {
            setZIndexHover(1000);
        }
    }, [hoverStyle, disableHoverAnimation]);

    const handleMouseLeave = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
        }
        setZIndexHover(undefined);
    }, []);

    // Calculate position based on handStyle
    let rotation = 0;
    let offsetX: number;
    let offsetY = 0;

    if (isFanStyle) {
        // Fan style: cards are arranged in an arc
        const fanAngle = Math.min(5, 40 / totalCards);
        rotation = (index - (totalCards - 1) / 2) * fanAngle;
        // Calculate position based on the arc
        const multiplier = totalCards > 7 ? 75 : totalCards > 5 ? 100 : totalCards > 3 ? 175 : 250;
        const radius = totalCards * multiplier;
        const angleInRadians = (rotation * Math.PI) / 180;
        offsetX = Math.sin(angleInRadians) * radius;
        offsetY = -1 * ((1 - Math.cos(angleInRadians)) * radius);
    } else {
        // Line style: cards are arranged in a straight line with overlap
        const overlap = 60;
        offsetX = index * overlap;
    }

    const { sx: cardContainerSx, ...otherCardContainerProps } = cardContainerProps || {};

    return (
        <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
                position: 'absolute',
                left: isFanStyle ? `calc(50% - 60px + ${offsetX}px)` : `${offsetX}px`,
                bottom: isFanStyle ? `${offsetY}px` : 0,
                transformOrigin: isFanStyle ? 'bottom center' : 'center',
                zIndex: zIndexHover ?? index,
                transform: isFanStyle ? `rotate(${rotation}deg)` : 'none',
                '&:hover': disableHoverAnimation
                    ? undefined
                    : {
                          transform: isFanStyle
                              ? `rotate(${rotation}deg) translateY(-20px) scale(1.1)`
                              : 'translateY(-10px) scale(1.1)',
                          cursor: 'pointer',
                      },
                transition: 'transform 0.2s ease-in-out',
                ...(cardContainerSx || {}),
            }}
            {...otherCardContainerProps}
        >
            <Card
                cardId={cardId}
                zoneId={zoneId}
                CardProps={CardProps}
                CardBackProps={CardBackProps}
                onClick={onCardClick}
            />
        </Box>
    );
};
