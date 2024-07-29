import {
    e2eMarketingPromoCodePromoLabel,
    e2eMarketingPromoCodePromoCodeAppliedText,
    e2eMarketingPromoCodePromoCodeTextField,
    e2eMarketingPromoCodePromoCodeApply,
    e2eMarketingPromoCodePromoCodeInvalidText
} from '@de-care/identification';
import { e2eLeadOfferDetailsPromoCodeApplied } from '@de-care/offers';

export const cyGetE2eMarketingPromoCodePromoLabel = () => cy.get(e2eMarketingPromoCodePromoLabel);
export const cyGetE2eMarketingPromoCodePromoCodeAppliedText = () => cy.get(e2eMarketingPromoCodePromoCodeAppliedText);
export const cyGetE2eMarketingPromoCodePromoCodeTextField = () => cy.get(e2eMarketingPromoCodePromoCodeTextField);
export const cyGetE2eMarketingPromoCodePromoCodeApply = () => cy.get(e2eMarketingPromoCodePromoCodeApply);
export const cyGetE2eMarketingPromoCodePromoCodeInvalidText = () => cy.get(e2eMarketingPromoCodePromoCodeInvalidText);

export const cyGetE2eLeadOfferDetailsPromoCodeApplied = () => cy.get(e2eLeadOfferDetailsPromoCodeApplied);
