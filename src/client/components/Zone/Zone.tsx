import React from 'react';
import { useSelector } from 'react-redux';
import { getZoneById } from '../../selectors';
import { ZoneHand } from './ZoneHand';
import { ZoneDeck } from './ZoneDeck';
import { ZonePile } from './ZonePile';
import { BoxProps, BadgeProps } from '@mui/material';
import { CardType } from '../..';

// Base props for all zone types
type ZoneBaseProps = {
    zoneId: string;
    CardProps?: any;
    CardBackProps?: any;
    onCardClick?: (cardId: string, zoneId: string) => void;
};

// Props specific to hand style
type ZoneHandProps = ZoneBaseProps & {
    styleType: 'hand';
    handStyle?: 'line' | 'fan';
    zoneHandContainerProps?: BoxProps;
    zoneHandCardContainerProps?: BoxProps;
    sortFn?: (cards: CardType<any>[]) => CardType<any>[];
    hoverStyle?: 'over' | 'overDelay' | 'none';
    disableHoverAnimation?: boolean;
};

// Props specific to deck style
type ZoneDeckProps = ZoneBaseProps & {
    styleType: 'deck';
    topCardsCount?: number;
    zoneDeckContainerProps?: BoxProps;
    zoneDeckCardContainerProps?: BoxProps;
    zoneDeckBadgeProps?: BadgeProps;
    showFirstCard?: boolean;
};

// Props specific to pile style
type ZonePileProps = ZoneBaseProps & {
    styleType: 'pile';
    topCardsCount?: number;
    zonePileContainerProps?: BoxProps;
    zonePileCardContainerProps?: BoxProps;
    onPileClick?: (zoneId: string) => void;
    allFaceDown?: boolean;
};

// Union type for all possible zone props
export type ZoneProps = ZoneHandProps | ZoneDeckProps | ZonePileProps;

/**
 * Zone component that displays a zone based on the zone id and style type.
 * @param zoneId - The id of the zone
 * @param styleType - The style type of the zone
 * @param handStyle - The style of the hand - only used if styleType is 'hand'
 * @param topCardsCount - The number of top cards to display - only used if styleType is 'deck' or 'pile'
 * @param zoneHandContainerProps - The props for the zone hand container
 * @param zoneHandCardContainerProps - The props for the zone hand card container
 * @param zoneDeckContainerProps - The props for the zone deck container
 * @param zoneDeckCardContainerProps - The props for the zone deck card container
 * @param zoneDeckBadgeProps - The props for the zone deck badge
 * @param zonePileContainerProps - The props for the zone pile container
 * @param zonePileCardContainerProps - The props for the zone pile card container
 * @param CardProps - The props for the card
 * @param CardBackProps - The props for the card back
 * @param onCardClick - The function to call when the card is clicked
 * @param onPileClick - The function to call when the pile is clicked if styleType is 'pile'
 * @param showFirstCard - Whether to show the first card - only used if styleType is 'deck'
 * @param sortFn - The function to call to sort the cards - only used if styleType is 'hand'
 * @param allFaceDown - Whether to show all cards face down - only used if styleType is 'pile'
 * @param hoverStyle - The style to apply when the card is hovered. Over increases the z index over the other cards in hand.
 * overDelay does the same after two-second delay. None does not increase the z index. Only when styleType is 'hand'.
 * @param disableHoverAnimation - Whether to disable the hover animation. Only when styleType is 'hand'.
 */
export const Zone: React.FC<ZoneProps> = (props) => {
    const { zoneId, styleType } = props;
    const zone = useSelector(getZoneById(zoneId));

    if (!zone) {
        return null;
    }

    switch (styleType) {
        case 'hand': {
            const {
                handStyle,
                zoneHandContainerProps,
                zoneHandCardContainerProps,
                CardProps,
                CardBackProps,
                onCardClick,
                sortFn,
                hoverStyle,
                disableHoverAnimation,
            } = props;
            return (
                <ZoneHand
                    zone={zone}
                    handStyle={handStyle}
                    containerProps={zoneHandContainerProps}
                    cardContainerProps={zoneHandCardContainerProps}
                    CardProps={CardProps}
                    CardBackProps={CardBackProps}
                    onCardClick={onCardClick}
                    sortFn={sortFn}
                    hoverStyle={hoverStyle}
                    disableHoverAnimation={disableHoverAnimation}
                />
            );
        }
        case 'deck': {
            const {
                topCardsCount,
                zoneDeckContainerProps,
                zoneDeckCardContainerProps,
                zoneDeckBadgeProps,
                CardProps,
                CardBackProps,
                onCardClick,
                showFirstCard,
            } = props;
            return (
                <ZoneDeck
                    zone={zone}
                    topCardsCount={topCardsCount}
                    containerProps={zoneDeckContainerProps}
                    cardContainerProps={zoneDeckCardContainerProps}
                    badgeProps={zoneDeckBadgeProps}
                    CardProps={CardProps}
                    CardBackProps={CardBackProps}
                    onCardClick={onCardClick}
                    showFirstCard={showFirstCard}
                />
            );
        }
        case 'pile': {
            const {
                topCardsCount,
                zonePileContainerProps,
                zonePileCardContainerProps,
                CardProps,
                CardBackProps,
                onPileClick,
                allFaceDown,
            } = props;
            return (
                <ZonePile
                    zone={zone}
                    topCardsCount={topCardsCount}
                    containerProps={zonePileContainerProps}
                    cardContainerProps={zonePileCardContainerProps}
                    CardProps={CardProps}
                    CardBackProps={CardBackProps}
                    onPileClick={onPileClick}
                    allFaceDown={allFaceDown}
                />
            );
        }
        default:
            return null;
    }
};
