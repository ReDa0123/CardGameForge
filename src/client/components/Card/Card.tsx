import React from 'react';
import { useSelector } from 'react-redux';
import { getZoneById, getNetworkInfo } from '../../selectors';
import { useDisplayRegistry } from '../../hooks';
import { Box, Paper } from '@mui/material';

type CardProps = {
    cardId: string;
    zoneId: string;
    isFaceDown?: boolean;
    onClick?: (cardId: string, zoneId: string) => void;
    CardBackProps?: any;
    CardProps?: any;
};

/**
 * Card component that displays a card in a zone based on the card id and zone id.
 * It uses the display registry to get the card display component.
 * It also handles the face down state of the card based on the zone owner and the current player.
 * @param cardId - The id of the card
 * @param zoneId - The id of the zone
 * @param isFaceDown - Whether the card is face down
 * @param CardBackProps - The props for the card back
 * @param onClick - The function to call when the card is clicked
 * @param CardProps - The props for the card
 */
export const Card: React.FC<CardProps> = ({
    cardId,
    zoneId,
    isFaceDown: forceFaceDown,
    onClick,
    CardBackProps,
    CardProps,
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
                backgroundColor: 'background.paper',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'transform 0.2s ease-in-out',
                userSelect: 'none',
                overflow: 'hidden',
                ...(CardProps?.sx ?? {}),
            }}
            onClick={handleClick}
            {...CardProps}
        >
            {isFaceDown ? (
                // Card back
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'text.primary',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'primary.contrastText',
                        fontWeight: 'bold',
                        ...(CardBackProps?.sx ?? {}),
                    }}
                    {...CardBackProps}
                >
                    {CardBackProps?.children}
                </Box>
            ) : (
                // Card front - use the display registry component
                <CardDisplay card={card} zone={zone} />
            )}
        </Paper>
    );
};
