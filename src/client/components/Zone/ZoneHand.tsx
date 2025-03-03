import React from 'react';
import { Zone as ZoneType } from '../../types/gameObjects';
import { Card } from '../Card';
import { Box, Paper, Typography, BoxProps } from '@mui/material';

type ZoneHandProps = {
    zone: ZoneType<any, any>;
    handStyle?: 'line' | 'fan';
    containerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    cardContainerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
};

export const ZoneHand: React.FC<ZoneHandProps> = ({
    zone,
    handStyle = 'fan',
    containerProps,
    cardContainerProps,
}) => {
    const cards = zone.cards;

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
            {cards.map((card, index) => {
                // Calculate position based on handStyle
                const totalCards = cards.length;
                let rotation = 0;
                let offsetX = 0;
                let offsetY = 0;

                if (handStyle === 'fan') {
                    // Fan style: cards are arranged in an arc
                    const fanAngle = Math.min(5, 40 / totalCards); // Max 5 degrees per card, or less if many cards
                    rotation = (index - (totalCards - 1) / 2) * fanAngle;
                    offsetY = Math.abs(rotation) * 2; // Cards at the edges are slightly lower
                } else {
                    // Line style: cards are arranged in a straight line with overlap
                    const overlap = totalCards > 7 ? 80 : 40; // More overlap if many cards
                    offsetX = index * overlap;
                }

                const { sx: cardContainerSx, ...otherCardContainerProps } =
                    cardContainerProps || {};

                return (
                    <Box
                        key={card.id}
                        sx={{
                            position: handStyle === 'line' ? 'relative' : 'absolute',
                            left: handStyle === 'fan' ? `calc(50% - 60px)` : undefined, // Center point for fan
                            zIndex: index,
                            transform:
                                handStyle === 'fan'
                                    ? `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${rotation}deg)`
                                    : undefined,
                            marginLeft:
                                handStyle === 'line' ? (index === 0 ? 0 : '-40px') : undefined,
                            ...(cardContainerSx || {}),
                        }}
                        {...otherCardContainerProps}
                    >
                        <Card
                            cardId={card.id}
                            zoneId={zone.id}
                            rotation={rotation}
                            offset={{ x: offsetX, y: offsetY }}
                        />
                    </Box>
                );
            })}
        </Box>
    );
};
