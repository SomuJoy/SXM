import { Offer } from './offer-renewal.interface';

export function getFirstOffer(offers: Offer[]): Offer | null {
    return !!offers && Array.isArray(offers) && !!offers[0] ? offers[0] : null;
}
