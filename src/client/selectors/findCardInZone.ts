import { ReduxState } from '../types/gameState';

export const findCardInZone =
    (cardId: string, zoneId: string) => (state: ReduxState<any, any, any, any>) => {
        const zone = state.game.coreState.zones[zoneId];
        if (!zone) {
            return undefined;
        }
        return zone.cards.find((card) => card.id === cardId);
    };
