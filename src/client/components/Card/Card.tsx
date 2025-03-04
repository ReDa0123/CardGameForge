import React from 'react';
import { useSelector } from 'react-redux';
import { getZoneById, getNetworkInfo } from '../../selectors';
import { useDisplayRegistry } from '../../hooks';
import { Box, Paper } from '@mui/material';

type CardProps = {
    cardId: string;
    zoneId: string;
    isFaceDown?: boolean;
    rotation?: number;
    offset?: { x: number; y: number };
    onClick?: (cardId: string, zoneId: string) => void;
};

export const Card: React.FC<CardProps> = ({
    cardId,
    zoneId,
    isFaceDown: forceFaceDown,
    rotation = 0,
    offset = { x: 0, y: 0 },
    onClick,
}) => {
    const zone = useSelector(getZoneById(zoneId));
    const card = zone?.cards!.find((card) => card.id === cardId);
    const { playerId } = useSelector(getNetworkInfo);
    // Get the display component from the registry
    const CardDisplay = useDisplayRegistry(card?.id ?? '', zoneId);

    if (!zone || !card) {
        return null;
    }

    // Determine if the card should be face down
    // If forceFaceDown is provided, use that value
    // Otherwise, check if the zone has an owner and if it's not the current player
    const isFaceDown =
        forceFaceDown !== undefined
            ? forceFaceDown
            : zone.owner !== undefined && zone.owner !== playerId;

    const handleClick = () => {
        if (onClick) {
            onClick(cardId, zoneId);
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                width: '120px',
                height: '168px', // Standard card ratio 2.5:3.5
                backgroundColor: isFaceDown ? '#6b7280' : 'white',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transform: `rotate(${rotation}deg) translate(${offset.x}px, ${offset.y}px)`,
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                userSelect: 'none',
                overflow: 'hidden',
            }}
            onClick={handleClick}
        >
            {isFaceDown ? (
                // Card back
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#6b7280',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                    }}
                >
                    Card
                </Box>
            ) : (
                // Card front - use the display registry component
                <CardDisplay card={card} zone={zone} />
            )}
        </Paper>
    );
};
