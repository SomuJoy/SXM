import {
    e2eOfferUpsell,
    e2eOfferUpsellContentCard,
    e2eOfferUpsellContentCardHeader,
    e2eOfferUpsellContentCardPromoDeal,
    e2eOfferUpsellContentCardDescription,
    e2eOfferUpsellContinueButton
} from '@de-care/offer-upsell';

export const cyGetOfferUpsell = () => cy.get(e2eOfferUpsell);
export const cyGetOfferUpsellContentCard = () => cy.get(e2eOfferUpsellContentCard);
export const cyGetOfferUpsellContentCardHeader = () => cy.get(e2eOfferUpsellContentCardHeader);
export const cyGetOfferUpsellContentCardPromoDeal = () => cy.get(e2eOfferUpsellContentCardPromoDeal);
export const cyGetOfferUpsellContentCardDescription = () => cy.get(e2eOfferUpsellContentCardDescription);
export const cyGetOfferUpsellContinueButton = () => cy.get(e2eOfferUpsellContinueButton);
