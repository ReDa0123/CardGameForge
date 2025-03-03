import { ReduxState } from '../types/gameState';
import { Zone } from '../types/gameObjects';

export const getZoneById =
    <CustomZone extends Record<string, any> = any, CustomCard extends Record<string, any> = any>(
        zoneId: string
    ) =>
    (state: ReduxState<any, any, any, any>): Zone<CustomZone, CustomCard> | undefined => {
        return state.game.coreState.zones[zoneId];
    };
