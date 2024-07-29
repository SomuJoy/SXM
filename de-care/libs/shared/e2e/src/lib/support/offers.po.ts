import { e2eHeroComponentHeading } from '@de-care/domains/offers/ui-hero';
import { e2eOfferDetailsWrapper } from '@de-care/domains/offers/ui-offer-details-wrapper';

export const cyGetHeroComponentHeading = () => cy.get(e2eHeroComponentHeading);
export const cyGetOfferDetailsWrapper = () => cy.get(e2eOfferDetailsWrapper);
