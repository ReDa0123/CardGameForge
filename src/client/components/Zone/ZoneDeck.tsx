import React from 'react';
import { Zone as ZoneType } from '../../types/gameObjects';
import { Card } from '../Card';
import { Box, Paper, Typography, Badge, BoxProps, BadgeProps } from '@mui/material';

type ZoneDeckProps = {
    zone: ZoneType<any, any>;
    topCardsCount?: number;
    containerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    cardContainerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    badgeProps?: Omit<BadgeProps, 'badgeContent' | 'children' | 'sx'> & { sx?: BadgeProps['sx'] };
};

export const ZoneDeck: React.FC<ZoneDeckProps> = ({
    zone,
    topCardsCount = 3,
    containerProps,
    cardContainerProps,
    badgeProps,
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
                    Empty Deck
                </Typography>
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
                        right: 5,
                        bottom: 5,
                        top: 'auto',
                        border: '2px solid #fff',
                        padding: '0 4px',
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
                                    <Card cardId={card.id} zoneId={zone.id} isFaceDown={true} />
                                ) : (
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            width: '120px',
                                            height: '168px',
                                            backgroundColor: '#6b7280',
                                            borderRadius: 2,
                                        }}
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
