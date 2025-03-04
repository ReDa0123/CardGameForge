import { ReduxState, CardTemplate } from '../types';

export const getCardCollection =
    <CustomCard extends Record<string, any> = any>() =>
    (state: ReduxState<any, any, any, CustomCard>) =>
        state.game.coreState.cardCollection as CardTemplate<CustomCard>[];
