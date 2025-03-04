import { useGameContext } from '../context';
import { useSelector } from 'react-redux';
import { findCardInZone } from '../selectors';
import React, { useMemo } from 'react';

export const useDisplayRegistry = (cardId: string, zoneId: string): React.ComponentType<any> => {
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
