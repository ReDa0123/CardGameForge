import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from '../../types/gameState';
import { SelectedCards } from './SelectedCards';
import { Box, Typography, BoxProps, TypographyProps } from '@mui/material';

type SelectedCardsMultiZoneProps = {
    zoneIds?: string[];
    title?: string;
    onCardClick?: (cardId: string, zoneId: string) => void;
    containerProps?: Omit<BoxProps, 'sx'> & { sx?: BoxProps['sx'] };
    titleProps?: Omit<TypographyProps, 'sx'> & { sx?: TypographyProps['sx'] };
    selectedCardsProps?: Omit<
        React.ComponentProps<typeof SelectedCards>,
        'zoneId' | 'title' | 'onCardClick'
    >;
};

export const SelectedCardsMultiZone: React.FC<SelectedCardsMultiZoneProps> = ({
    zoneIds,
    title = 'Selected Cards',
    onCardClick,
    containerProps,
    titleProps,
    selectedCardsProps,
}) => {
    // Get the entire selection object
    const selection = useSelector(
        (state: ReduxState<any, any, any, any>) => state.game.coreState.selection
    );

    // If zoneIds is provided, filter the selection to only include those zones
    // Otherwise, use all zones that have selected cards
    const relevantZoneIds = zoneIds
        ? zoneIds.filter((zoneId) => selection[zoneId]?.length > 0)
        : Object.keys(selection).filter((zoneId) => selection[zoneId]?.length > 0);

    // Extract sx from props to avoid duplicate props
    const { sx: containerSx, ...otherContainerProps } = containerProps || {};
    const { sx: titleSx, ...otherTitleProps } = titleProps || {};

    if (relevantZoneIds.length === 0) {
        return (
            <Box sx={{ mb: 2, ...(containerSx || {}) }} {...otherContainerProps}>
                <Typography variant="h6" sx={{ mb: 1, ...(titleSx || {}) }} {...otherTitleProps}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    No cards selected
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mb: 2, ...(containerSx || {}) }} {...otherContainerProps}>
            <Typography variant="h6" sx={{ mb: 1, ...(titleSx || {}) }} {...otherTitleProps}>
                {title}
            </Typography>
            {relevantZoneIds.map((zoneId) => (
                <SelectedCards
                    key={zoneId}
                    zoneId={zoneId}
                    title={`Zone: ${zoneId}`}
                    onCardClick={onCardClick}
                    {...selectedCardsProps}
                />
            ))}
        </Box>
    );
};
