import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

export const mockResponses = {
    allPackageDescriptions: require('../../../../../fixtures/features/smoke-tests/checkout/tier-up-targeted/all-package-descriptions.json'),
    account: require('../../../../../fixtures/features/smoke-tests/checkout/tier-up-targeted/package-upgrade-account.json'),
    offers: require('../../../../../fixtures/features/smoke-tests/checkout/tier-up-targeted/customer-offers.json'),
    offersInfo: require('../../../../../fixtures/features/smoke-tests/checkout/tier-up-targeted/offers-info.json'),
    customerInfoAddressAutoCorrect: require('../../../../../fixtures/features/smoke-tests/checkout/tier-up-targeted/customer-info-address-auto-correct.json'),
    quote: require('../../../../../fixtures/features/smoke-tests/checkout/tier-up-targeted/quote.json'),
    captchaFalse: require('../../../../../fixtures/features/smoke-tests/checkout/tier-up-targeted/captcha-false.json'),
    changeSubscriptionSuccess: require('../../../../../fixtures/features/smoke-tests/checkout/tier-up-targeted/change-subscription-success.json'),
    securityQuestions: require('../../../../../fixtures/features/smoke-tests/checkout/tier-up-targeted/security-questions.json'),
};

Before(() => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.route('POST', '**/offers/all-package-desc', mockResponses.allPackageDescriptions);
});

Given(/^an eligible customer visits the page with the program code UPM3MOAAFREE$/, () => {
    cy.viewport(900, 1200);
    cy.route('POST', '**/account/token/pkg-upgrade', mockResponses.account);
    cy.route('POST', '**/offers/customer', mockResponses.offers);
    cy.route('POST', '**/offers/info', mockResponses.offersInfo);
    cy.visit('/subscribe/checkout/upgrade/tier-up/targeted?tkn=24b3d7cc-7372-4e7a-8098-68db0ae6ee79&programcode=UPM3MOAAFREE');
});
Then(/^they should be presented with the correct upgrade offer$/, () => {
    cy.get('de-care-tier-up-offer').should('be.visible');
});

When(/^they select use card on file and continue from the payment step$/, () => {
    cy.route('POST', '**/validate/customer-info', mockResponses.customerInfoAddressAutoCorrect);
    cy.route('POST', '**/quotes/quote', mockResponses.quote);
    cy.route('POST', '**/check-eligibility/captcha', mockResponses.captchaFalse);
    cy.get('#paymentForm sxm-ui-radio-option-form-field[value="CARD_ON_FILE"] input').click({ force: true });
    cy.get('#paymentForm button[sxm-proceed-button]').click({ force: true });
});
And(/^they accept the terms and submit the transaction$/, () => {
    cy.route('POST', '**/purchase/change-subscription', mockResponses.changeSubscriptionSuccess);
    cy.route('GET', '**/utility/security-questions', mockResponses.securityQuestions);
    cy.get('input[name="chargeAgreementAccepted"]').click({ force: true });
    cy.get('#transactionForm button[sxm-proceed-button]').click({ force: true });
});
Then(/^they should be redirected to the confirmation page$/, () => {});
