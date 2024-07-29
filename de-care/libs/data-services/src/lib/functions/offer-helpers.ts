import { PlanTypeEnum } from '../enums/plan-type.enum';
import { OfferModel, PackageModel } from '../models/offer.model';

export function offerIsStreaming(offer: OfferModel): boolean {
    if (offer && offer.offers && offer.offers.length > 0) {
        return offer.offers[0].streaming;
    }
    return false;
}

/**
 * @deprecated use isBetterOffer from @de-care/domains/offers/state-offers
 */
export function isBetterOffer(offer: PackageModel, leadOfferType: string): boolean {
    let betterOffer = false;
    if (offer.mrdEligible) {
        betterOffer = true;
    } else if (leadOfferType === 'SELF_PAY' && offer.type !== 'SELF_PAY') {
        betterOffer = true;
    } else if (offer.fallback === true && offer.fallbackReason === 'PARTNER_INELIGIBLE') {
        betterOffer = true;
    }
    return betterOffer;
}

export function getMrdDiscount(offer: PackageModel): number {
    if (offer && offer.mrdEligible) {
        return offer.msrpPrice - offer.pricePerMonth;
    }
    return 0;
}

export function getFirstOffer(offerModel: OfferModel): PackageModel | null {
    return !!offerModel && Array.isArray(offerModel.offers) && !!offerModel.offers[0] ? offerModel.offers[0] : null;
}

export const getFirstOfferPackageName = (offer: OfferModel): string => {
    const firstOffer = getFirstOffer(offer);
    return firstOffer ? firstOffer.packageName : null;
};

export const isOfferRtc = (offer: OfferModel) => {
    const streaming = offerIsStreaming(offer);
    const firstOffer = offer && offer.offers && offer.offers.length > 0 && offer.offers[0];
    const isRTC = firstOffer && (firstOffer.type === PlanTypeEnum.TrialExtensionRTC || firstOffer.type === PlanTypeEnum.RtcOffer) && !streaming;
    return isRTC;
};

export function isOfferMCP(val: PlanTypeEnum) {
    return [PlanTypeEnum.PromoMCP].indexOf(val) !== -1;
}

export function isOfferRTP(val: PlanTypeEnum) {
    return [PlanTypeEnum.RtpOffer].indexOf(val) !== -1;
}
