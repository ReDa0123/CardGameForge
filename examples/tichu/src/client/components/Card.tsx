import React from 'react';
import { Typography, Box } from '@mui/material';
import { CardComponent } from 'cardgameforge/client/types';
import { useSelector, isSelected } from 'cardgameforge/client';
import { CardSuit, TichuCard } from 'src/server/types';

const cardColors: {
    [key in CardSuit]: string;
} = {
    RED: 'red',
    GREEN: 'green',
    BLUE: 'blue',
    BLACK: 'black',
};

export const Card: CardComponent<TichuCard, any> = ({ card, zone }) => {
    const isSpecial = card.templateFields.custom!.isSpecial;
    const text = isSpecial ? card.templateFields.name : card.templateFields.name.split(' ')[0];
    const isCardSelected = useSelector(isSelected(card.id, zone.id));

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
                ...(isCardSelected
                    ? {
                          border: '2px solid red',
                          borderColor: 'primary.main',
                          borderRadius: 2,
                          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
                      }
                    : {}),
            }}
        >
            {isSpecial ? (
                <Typography
                    sx={{
                        color: 'black',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 2,
                        fontWeight: 'bold',
                    }}
                >
                    {text}
                </Typography>
            ) : (
                <>
                    <Typography
                        sx={{
                            color: cardColors[card.templateFields.custom!.suit!],
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            fontWeight: 'bold',
                        }}
                    >
                        {text}
                    </Typography>
                    <Typography
                        sx={{
                            color: cardColors[card.templateFields.custom!.suit!],
                            position: 'absolute',
                            bottom: 16,
                            right: 16,
                            fontWeight: 'bold',
                            transform: 'rotate(180deg)',
                        }}
                    >
                        {text}
                    </Typography>
                </>
            )}
        </Box>
    );
};
