import { Offer } from './offer.interface';
import { OfferTypeEnum } from './offer-type.enum';

export enum PackagePlatformEnum {
    Xm = 'XM',
    Siriusxm = 'SiriusXM',
    Sirius = 'SIRIUS',
}

export function getFirstOffer(offers: Offer[]): Offer | null {
    return !!offers && Array.isArray(offers) && !!offers[0] ? offers[0] : null;
}

export function getSecondOffer(offers: Offer[]): Offer | null {
    return !!offers && Array.isArray(offers) && !!offers[1] ? offers[1] : null;
}

export function isOfferMCP(val): boolean {
    return ['PROMO_MCP'].indexOf(val) !== -1;
}

export function isOfferRTP(val: string) {
    return ['RTP_OFFER'].indexOf(val) !== -1;
}

export function offerMarketTypeIsPromotional(marketType: string) {
    return marketType === 'self-pay:promo';
}

export function offerMarketTypeIsDiscount(marketType: string) {
    return marketType === 'self-pay:discounted';
}

export function offerTypeIsSelfPay(offerType: string): boolean {
    return offerType === 'SELF_PAY' || offerType === 'SELF_PAID';
}

export function offerTypeIsIntroductory(offerType: string): boolean {
    return offerType === 'INTRODUCTORY';
}
export function offerTypeIsAdvantage(offerType: string): boolean {
    return offerType === 'ADVANTAGE';
}

export function offerTypeIsNextOrForward(offerType: string): boolean {
    return offerType === 'NEXT' || offerType === 'FORWARD';
}

export function getOffersSavings(retailPrice: number, offerPrice: number): number {
    return Math.round((retailPrice - offerPrice) * 100) / 100;
}
export function dealIsHulu(deal: string): boolean {
    return deal === 'Hulu';
}

export function dealTypeIsAmazonDot(type: string): boolean {
    return type === 'AMZ_DOT';
}

export function getOffersPlanCodeAndPrice(offers: Offer[]) {
    return offers && Array.isArray(offers) && offers?.length > 0
        ? offers.map((offer) => {
              return { planCode: offer?.planCode, price: offer?.price };
          })
        : null;
}
export function getMarketTypeFromFirstOffer(offers: Offer[]) {
    const offer = getFirstOffer(offers);
    return offer?.marketType || null;
}
export function isFreeOffer(offerType: string): boolean {
    return offerType === 'TRIAL_EXT' || offerType === 'TRIAL_EXT_RTC';
}
export function getPlatformFromPackageName(packageName: string): PackagePlatformEnum {
    if (packageName.startsWith('1_')) {
        return PackagePlatformEnum.Xm;
    } else if (packageName.startsWith('SXM_') || packageName.startsWith('3_')) {
        return PackagePlatformEnum.Siriusxm;
    } else {
        return PackagePlatformEnum.Sirius;
    }
}
export function isBetterOffer(offer: { mrdEligible: boolean; type: string }, leadOfferType: string): boolean {
    let betterOffer = false;
    if (offer.mrdEligible) {
        betterOffer = true;
    } else if (leadOfferType === 'SELF_PAY' && offer.type !== 'SELF_PAY') {
        betterOffer = true;
    }
    return betterOffer;
}

export const isOfferRtc = (offer: { type: string; streaming?: boolean | undefined }) => {
    return offer.type === 'TRIAL_EXT_RTC' && !offer.streaming;
};

export function typeToOfferType(type: string): string {
    if (type === OfferTypeEnum.Promo || type === OfferTypeEnum.TrialExtension) {
        return type;
    } else if (type === OfferTypeEnum.RtpOffer || type === OfferTypeEnum.Trial || type === OfferTypeEnum.TrialRtp) {
        return OfferTypeEnum.Promo;
    }
    return OfferTypeEnum.Default;
}

export function offerToOfferDetails(offer) {
    return (
        offer && {
            type: offer.deal ? offer.deal.type : typeToOfferType(offer.type),
            offerTotal: offer.price,
            processingFee: offer.processingFee,
            msrpPrice: offer.msrpPrice,
            name: offer.packageName,
            offerTerm: offer.termLength,
            offerMonthlyRate: offer.pricePerMonth,
            savingsPercent: Math.floor(((offer.retailPrice - offer.pricePerMonth) / offer.retailPrice) * 100),
            retailRate: offer.retailPrice,
            etf: offer.deal && offer.deal.etfAmount,
            etfTerm: offer.deal && offer.deal.etfTerm,
            priceChangeMessagingType: offer.priceChangeMessagingType,
            isStreaming: false,
            deal: offer.deal,
            isMCP: isOfferMCP(offer.type),
            isLongTerm: offer.type === 'LONG_TERM' ? true : false,
            offerType: offer.type,
        }
    );
}

export function packageTypeIsSelect(packageName: string): boolean {
    return packageName.endsWith('SIR_AUD_EVT') || packageName.endsWith('SIR_CAN_EVT');
}

export function getPackageNameWithoutPlatform(value: string, packageName: string): string {
    if (!value || value.length === 0) {
        return value;
    }
    if (!packageName || packageName.length === 0) {
        return value;
    }

    const platform = getPlatformFromPackageName(packageName);
    const words = value.split(' ');
    const hasPlatform = words.findIndex((p: string) => p.toLowerCase() === platform.toLowerCase());
    const hasPlatformFr = words.findIndex((p: string) => p.toLowerCase() === 'de');

    if (hasPlatform >= 0) {
        words.splice(hasPlatform, 1);
        if (hasPlatformFr >= 0) {
            words.splice(hasPlatformFr, 1);
        }
    } else if (words.includes('Streaming') || words.includes('ligne')) {
        //Adding special handling for Streaming as it always has SiriusXM
        words.splice(words.indexOf('SiriusXM'), 1);
    }

    return words.join(' ');
}
