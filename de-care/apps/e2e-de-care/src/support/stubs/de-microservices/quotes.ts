export const stubQuotesSwapRadioQuoteSuccess = () => {
    cy.intercept('POST', '**/services/quotes/swap-radio-quote', { fixture: 'de-microservices/quotes/swap-radio-quote' });
};

export const stubQuotesAcscQuoteOrganicSuccess = () => {
    cy.intercept('POST', '**/services/quotes/acsc-quote', { fixture: 'de-microservices/quotes/acsc-quote/organic_success.json' });
};

export const stubQuotesQuotePromoAllAccess12Mo99 = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/promo-aa-12mo-99.json' });
};

export const stubQuotesQuoteStreamingNonAccordionTargetedEssentialStreamingMonthly = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/streaming-non-accordion-targeted_essential-streaming-monthly.json' });
};

export const stubQuotesQuoteStreamingNonAccordionTargetedMultiRadioDiscountFirstOffer = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/streaming-non-accordion-targeted_multi-radio-discount-first-offer.json' });
};

export const stubQuotesQuoteStreamingNonAccordionTargetedMultiRadioDiscountAddStreaming = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/streaming-non-accordion-targeted_multi-radio-discount-add-streaming.json' });
};

export const stubQuotesQuoteStreamingAccordionOrganicSuccess = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/streaming-accordion-organic_success.json' });
};

export const stubQuotesReactivationQuote = () => {
    cy.intercept('POST', '**/services/quotes/reactivation-quote', { fixture: 'de-microservices/quotes/reactivation-quote/success.json' });
};

export const stubQuotesQuoteStreamingNonAccordionOrganicSuccess = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/streaming-non-accordion-organic_success.json' });
};

export const stubQuotesQuoteStreamingNonAccordionOrganicSuccessAsQuote = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/streaming-non-accordion-organic_success.json' }).as('quote');
};

export const stubQuotesQuoteSatelliteOrganicPromoSelfPay = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/satellite-organic_promo-self-pay.json' });
};

export const stubQuotesQuoteSatelliteOrganicChangePlatformSuccess = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/satellite-organic_change-platform-success.json' });
};

export const stubQuotesQuoteSatelliteCommonUpgradeVipOneRadio = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/satellite-common_upgrade-vip-one-radio.json' });
};

export const stubQuotesQuoteSatelliteCommonUpgradeVipOneRadioFailure = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/satellite-common_upgrade-vip-one-radio-error.json', statusCode: 400 });
};

export const stubQuotesQuoteSatelliteTargetedSatellitePromoSelfPay = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/satellite-targeted_satellite-promo-self-pay.json' });
};

export const stubQuotesQuoteStreamingCommonUpsellTerm = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/streaming-common_upsell-term.json' });
};

export const stubQuotesQuoteStreamingCommonFallback = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/streaming-common_fallback.json' });
};

export const stubQuotesQuotePromoSelfPaySixMonthsDiscountThenBasePrice = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/promo-6mo-discount-then-standard-pay-success.json' });
};

export const stubQuotesQuotePromoSelfPayFiveMonthsDiscountThenBasePrice = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/promo-5mo-discount-then-standard-pay-success.json' });
};

export const stubQuotesQuotePromoSelfPayXmPlatinumPackageUpgrade = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/satellite-organic-package-upgrade-xm-platinum.json' });
};

export const stubQuotesQuotePromoSelfPayTermUpgradeTwelveMonths = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/satellite-organic-term-upgrade-12-months.json' });
};

export const stubQuotesQuotePromoSelfPayPackageAndTermUpgrade = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/satellite-organic-checkout-package-and-term-upgrade.json' });
};

export const stubQuotesQuoteDefaultSelfPayFinalQuote = () => {
    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/satellite-organic-checkout-default-self-pay-package-final-quote.json' });
};
