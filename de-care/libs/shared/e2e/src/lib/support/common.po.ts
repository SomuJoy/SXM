import { getOfferDescriptionFooter } from '@de-care/domains/offers/ui-offer-card';
import { getOfferPromoPriceAndTerm } from '@de-care/domains/offers/ui-offer-description';

export const cyGetSpinner = () => cy.get('#sxm-loader', { timeout: 10000 });
export const cyGetOfferPromoPriceAndTerm = () => cy.get(getOfferPromoPriceAndTerm);
export const cyGetOfferDescriptionFooter = () => cy.get(getOfferDescriptionFooter);
