export const stubQuotesQuoteSelfPayPromoSuccess = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'quotes/quotes-quote_self-pay-promo.json' });
};
