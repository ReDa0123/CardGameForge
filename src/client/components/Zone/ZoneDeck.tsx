import React from 'react';
import { Zone as ZoneType } from '../../types';
import { Card } from '../Card';
import { Box, Paper, Typography, Badge, BoxProps, BadgeProps } from '@mui/material';

type ZoneDeckProps = {
    zone: ZoneType<any, any>;
    topCardsCount?: number;
    containerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    cardContainerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    badgeProps?: Omit<BadgeProps, 'badgeContent' | 'children' | 'sx'> & { sx?: BadgeProps['sx'] };
    CardProps?: any;
    CardBackProps?: any;
    onCardClick?: (cardId: string, zoneId: string) => void;
    showFirstCard?: boolean;
};

/**
 * ZoneDeck component that displays a deck of cards.
 * @param zone - The zone
 * @param topCardsCount - The number of top cards to display
 * @param containerProps - The props for the container
 * @param cardContainerProps - The props for the card container
 * @param badgeProps - The props for the badge
 * @param CardProps - The props for the card
 * @param CardBackProps - The props for the card back
 * @param onCardClick - The function to call when the card is clicked
 * @param showFirstCard - Whether to show the first card
 */
export const ZoneDeck: React.FC<ZoneDeckProps> = ({
    zone,
    topCardsCount = 3,
    containerProps,
    cardContainerProps,
    badgeProps,
    CardProps = {},
    CardBackProps = {},
    showFirstCard = false,
    onCardClick,
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
                    color: 'text.secondary',
                    userSelect: 'none',
                    backgroundColor: 'background.paper',
                    p: 2,
                    textAlign: 'center',
                    ...(containerProps?.sx || {}),
                }}
            >
                <Typography variant="body2">Empty Deck {zone.name}</Typography>
            </Paper>
        );
    }

    const visibleCardCount = Math.min(cardCount, topCardsCount);

    const visibleCardIndices = Array.from({ length: visibleCardCount }, (_, i) => i);

    const { sx: containerSx, ...otherContainerProps } = containerProps || {};
    const { sx: badgeSx, ...otherBadgeProps } = badgeProps || {};

    return (
        <Box sx={{ position: 'relative', ...(containerSx || {}) }} {...otherContainerProps}>
            <Badge
                badgeContent={cardCount}
                color="primary"
                sx={{
                    '& .MuiBadge-badge': {
                        left: -15,
                        top: 5,
                        right: 'auto',
                        border: '2px solid #fff',
                        borderColor: 'primary.contrastText',
                        padding: '0 4px',
                        bgcolor: 'primary.dark',
                        color: 'primary.contrastText',
                        userSelect: 'none',
                        zIndex: 1000,
                    },
                    ...(badgeSx || {}),
                }}
                {...otherBadgeProps}
            >
                <Box
                    sx={{
                        position: 'relative',
                        width: '120px',
                        height: '168px',
                    }}
                >
                    {visibleCardIndices.map((_, index) => {
                        const isTopCard = index === visibleCardIndices.length - 1;
                        const card = cards[index];
                        const offset = 2 * index;

                        const { sx: cardContainerSx, ...otherCardContainerProps } =
                            cardContainerProps || {};

                        return (
                            <Box
                                key={isTopCard ? card.id : `deck-card-${index}`}
                                sx={{
                                    position: 'absolute',
                                    top: `${offset}px`,
                                    left: `${offset}px`,
                                    zIndex: index,
                                    ...(cardContainerSx || {}),
                                }}
                                {...otherCardContainerProps}
                            >
                                {isTopCard ? (
                                    <Card
                                        cardId={card.id}
                                        zoneId={zone.id}
                                        isFaceDown={!showFirstCard}
                                        CardProps={CardProps}
                                        CardBackProps={CardBackProps}
                                        onClick={onCardClick}
                                    />
                                ) : (
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            width: '120px',
                                            height: '168px',
                                            backgroundColor: 'background.paper',
                                            borderRadius: 2,
                                            border: '1px solid rgba(0, 0, 0, 0.3)',
                                            ...(CardBackProps?.sx || {}),
                                        }}
                                        {...CardBackProps}
                                    />
                                )}
                            </Box>
                        );
                    })}
                </Box>
            </Badge>
        </Box>
    );
};
