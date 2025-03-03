import React from 'react';
import { useSelector } from 'react-redux';
import { getZoneById } from '../../selectors/getZoneById';
import { ZoneHand } from './ZoneHand';
import { ZoneDeck } from './ZoneDeck';
import { ZonePile } from './ZonePile';
import { BoxProps, BadgeProps } from '@mui/material';

// Base props for all zone types
type ZoneBaseProps = {
    zoneId: string;
};

// Props specific to hand style
type ZoneHandProps = ZoneBaseProps & {
    styleType: 'hand';
    handStyle?: 'line' | 'fan';
    zoneHandContainerProps?: BoxProps;
    zoneHandCardContainerProps?: BoxProps;
};

// Props specific to deck style
type ZoneDeckProps = ZoneBaseProps & {
    styleType: 'deck';
    topCardsCount?: number;
    zoneDeckContainerProps?: BoxProps;
    zoneDeckCardContainerProps?: BoxProps;
    zoneDeckBadgeProps?: BadgeProps;
};

// Props specific to pile style
type ZonePileProps = ZoneBaseProps & {
    styleType: 'pile';
    topCardsCount?: number;
    zonePileContainerProps?: BoxProps;
    zonePileCardContainerProps?: BoxProps;
};

// Union type for all possible zone props
export type ZoneProps = ZoneHandProps | ZoneDeckProps | ZonePileProps;

export const Zone: React.FC<ZoneProps> = (props) => {
    const { zoneId, styleType } = props;
    const zone = useSelector(getZoneById(zoneId));

    if (!zone) {
        return null;
    }

    switch (styleType) {
        case 'hand': {
            const { handStyle, zoneHandContainerProps, zoneHandCardContainerProps } = props;
            return (
                <ZoneHand
                    zone={zone}
                    handStyle={handStyle}
                    containerProps={zoneHandContainerProps}
                    cardContainerProps={zoneHandCardContainerProps}
                />
            );
        }
        case 'deck': {
            const {
                topCardsCount,
                zoneDeckContainerProps,
                zoneDeckCardContainerProps,
                zoneDeckBadgeProps,
            } = props;
            return (
                <ZoneDeck
                    zone={zone}
                    topCardsCount={topCardsCount}
                    containerProps={zoneDeckContainerProps}
                    cardContainerProps={zoneDeckCardContainerProps}
                    badgeProps={zoneDeckBadgeProps}
                />
            );
        }
        case 'pile': {
            const { topCardsCount, zonePileContainerProps, zonePileCardContainerProps } = props;
            return (
                <ZonePile
                    zone={zone}
                    topCardsCount={topCardsCount}
                    containerProps={zonePileContainerProps}
                    cardContainerProps={zonePileCardContainerProps}
                />
            );
        }
        default:
            return null;
    }
};
