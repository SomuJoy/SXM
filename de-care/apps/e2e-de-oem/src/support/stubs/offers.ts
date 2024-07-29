export const stubAllPackageDescriptionsSuccess = () => {
    cy.intercept('POST', '**/services/offers/all-package-desc', { fixture: 'offers/offers-all-package-descriptions-success.json' });
};
export const stubOffersCustomerSelfPayPromoSuccess = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: 'offers/offers-customer_self-pay-promo.json' });
};
export const stubOffersInfoSelfPayPromoSuccess = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'offers/offers-info_self-pay-promo.json' });
};
