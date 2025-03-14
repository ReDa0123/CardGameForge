import { useGameContext } from '../context';
import { useSelector } from 'react-redux';
import { findCardInZone } from '../selectors';
import React, { useMemo } from 'react';
import { CardComponent } from '../types';

/**
 * React hook that returns the display component for a card.
 * @param cardId - The id of the card
 * @param zoneId - The id of the zone
 */
export const useDisplayRegistry = (cardId: string, zoneId: string): CardComponent => {
    const card = useSelector(findCardInZone(cardId, zoneId));
    const gameContext = useGameContext();
    const displayRegistry = useMemo(() => gameContext.displayRegistry, [gameContext]);

    return useMemo<React.ComponentType<any>>(() => {
        if (!card) {
            return displayRegistry.default;
        }
        const cardDisplayType = card.templateFields.displayType;
        const typeInRegistry = displayRegistry.displayTypes?.[cardDisplayType];
        if (!typeInRegistry) {
            return displayRegistry.default;
        }
        return typeInRegistry.zones?.[zoneId] ?? typeInRegistry.default;
    }, [card, displayRegistry.default, displayRegistry.displayTypes, zoneId]);
};
