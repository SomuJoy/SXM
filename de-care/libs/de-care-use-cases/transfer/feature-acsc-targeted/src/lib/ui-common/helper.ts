import { isAllAccessPackage, isMostlyMusicPackage, isSelectPackage } from '@de-care/data-services';
import { Offer } from '@de-care/domains/offers/state-renewals';

export function isOfferMCP(offer: Offer): boolean {
    return offer?.type.includes('PROMO_MCP');
}

export function isRetailOffer(offer: Offer) {
    return ['SELF_PAY', 'INTRODUCTORY'].includes(offer?.type);
}

export function isRetailOffers(offers: Offer[]) {
    return offers.every(isRetailOffer);
}

export function isOfferTrialExt(offer: Offer): boolean {
    return offer?.type === 'TRIAL_EXT';
}

export function hasSelectPromoAndMostlyMusicRetailPlan(offers: Offer[]) {
    const hasSelectPromo = offers.some((offer) => {
        return isSelectPackage(offer.packageName) && !isRetailOffer(offer);
    });
    const hasMostlyMusicRetailPlan = offers.some((offer) => {
        return isMostlyMusicPackage(offer.packageName) && isRetailOffer(offer);
    });
    return hasSelectPromo && hasMostlyMusicRetailPlan;
}

export function hasAllAccessAndSelectPromos(offers: Offer[]) {
    const hasSelectPromo = offers.some((offer) => {
        return isSelectPackage(offer.packageName) && !isRetailOffer(offer);
    });
    const hasAllAccessPromo = offers.some((offer) => {
        return isAllAccessPackage(offer.packageName) && !isRetailOffer(offer);
    });
    return hasSelectPromo && hasAllAccessPromo;
}

export function getPackageKey(packageName) {
    return 'app.packageDescriptions.' + packageName + '.name';
}
