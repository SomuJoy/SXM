import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { acceptAndSubmitTransaction, fillOutAndSubmitPaymentInfoForm, fillOutSecurityQuestion, mockOfferCalls, mockSuccessfulPaymentInfoCalls } from './helpers';

export const mockResponses = {
    allPackageDescriptions: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/all-package-descriptions.json'),
    deviceValidate: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/device-validate-success.json'),
    nonPiiTrial: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/non-pii-trial.json'),
    nonPiiTrialToken: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/non-pii-token-trial-radio.json'),
    nonPiiTrialWithVehicleInfo: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/non-pii-trial-vehicle-info.json'),
    nonPiiExistingSelfPay: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/non-pii-existing-self-pay-subscription.json'),
    nonPiiExistingSelfPayNoFollowOn: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/non-pii-existing-self-pay-subscription-no-follow-on.json'),
    nonPiiClosedRadio: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/non-pii-closed-radio.json'),
    customerOffers: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/customer-offers.json'),
    offersInfo: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/offers-info.json'),
    validateCustomerInfoAddress: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/validate-customer-info-address.json'),
    captchaNotRequired: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/check-eligibility-captcha-not-needed.json'),
    quoteAllAccess: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/quote-all-access.json'),
    quoteMostlyMusic: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/quote-mostly-music.json'),
    quoteSelect: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/quote-select.json'),
    changeSubscriptionCreditCardFailed: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/change-subscription-credit-card-failed.json'),
    changeSubscriptionSuccessSelect: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/change-subscription-success-select.json'),
    changeSubscriptionSuccessAllAccess: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/change-subscription-success-all-access.json'),
    addSubscriptionSuccessAllAccess: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/add-subscription-success-all-access.json'),
    securityQuestions: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/security-questions.json'),
    registration: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/registration.json'),
    legacyCheckoutOffers: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/legacy-checkout-offers.json'),
    legacyCheckoutRenewals: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/legacy-checkout-renewals.json'),
    legacyCheckoutOffersInfo: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/legacy-checkout-offers-info.json'),
};

Before(() => {
    cy.viewport(900, 1200);
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.route('POST', '**/offers/all-package-desc', mockResponses.allPackageDescriptions);
    cy.route('POST', '**/device/validate', mockResponses.deviceValidate);
});

Given(/^a customer visits the page with the program code 3FOR1AAPYP$/, () => {
    cy.route('POST', '**/account/non-pii', mockResponses.nonPiiTrial);
    mockOfferCalls(mockResponses.customerOffers, mockResponses.offersInfo);
    cy.visit('/subscribe/checkout/purchase/satellite/targeted?radioid=X65100AH&act=10000209100&programcode=3FOR1AAPYP');
});

Then(/^they should be presented with the correct default selected offer and the option to choose another$/, () => {
    cy.get('sxm-ui-primary-package-card').should('be.visible').should('contain', 'SiriusXM Platinum');
    cy.get('#changeLeadOfferButton').should('be.visible');
});

Given(/^a customer with vehicleInfo visits the page with the program code 3FOR1AAPYP$/, () => {
    cy.route('POST', '**/account/non-pii', mockResponses.nonPiiTrialWithVehicleInfo);
    mockOfferCalls(mockResponses.customerOffers, mockResponses.offersInfo);
    cy.visit('/subscribe/checkout/purchase/satellite/targeted?radioid=X65100AE&act=10000209100&programcode=3FOR1AAPYP');
});
Then(/^the vehicleInfo should be displayed correctly$/, () => {
    cy.get('#radioInfo').should('be.visible').should('contain', 'Vehicle: 2020 Ford Mustang');
});

Given(/^a customer visits the page with a token and the program code 3FOR1AAPYP$/, () => {
    cy.route('POST', '**/account/token', mockResponses.nonPiiTrialWithVehicleInfo);
    mockOfferCalls(mockResponses.customerOffers, mockResponses.offersInfo);
    cy.visit('/subscribe/checkout/purchase/satellite/targeted?token=bef17703-a3d3-4296-ab19-4cf78bcfb4e7&programcode=3FOR1SELPYP');
});

Given(/^a customer with an existing trial goes through the targeted satellite purchase steps with the program code 3FOR1AAPYP$/, () => {
    cy.route('POST', '**/account/non-pii', mockResponses.nonPiiTrial);
    mockOfferCalls(mockResponses.customerOffers, mockResponses.offersInfo);
    cy.visit('/subscribe/checkout/purchase/satellite/targeted?radioid=X65100AE&act=10000209100&programcode=3FOR1AAPYP');
});
When(/^the customer successfully completes a transaction$/, () => {
    cy.get('#inTrialInfoText').should('be.visible');
    mockSuccessfulPaymentInfoCalls(mockResponses.validateCustomerInfoAddress, mockResponses.captchaNotRequired, mockResponses.quoteAllAccess);
    fillOutAndSubmitPaymentInfoForm();
    cy.route('POST', '**/purchase/change-subscription', mockResponses.changeSubscriptionSuccessAllAccess);
    cy.route('GET', '**/utility/security-questions', mockResponses.securityQuestions);
    acceptAndSubmitTransaction();
});
Then(/^they should land on the confirmation page$/, () => {
    cy.url().should('contain', 'subscribe/checkout/purchase/satellite/targeted/thanks');
});
Then(/^they should be able to register on the confirmation page$/, () => {
    cy.get('register-your-account form').within(() => {
        cy.get('input[data-e2e="sxmUIPassword"]').clear({ force: true }).type('P4SSw0rd#', { force: true });
        fillOutSecurityQuestion(0, 'batty');
        fillOutSecurityQuestion(1, 'baseball field');
        fillOutSecurityQuestion(2, '911');
    });
    cy.route('POST', '**/account/register', mockResponses.registration);
    cy.get('register-your-account button[sxm-proceed-button]').click({ force: true });
});

Given(/^a customer with an existing active subscription visits the page with the program code 3FOR1AAPYP$/, () => {
    cy.route('POST', '**/account/non-pii', mockResponses.nonPiiExistingSelfPayNoFollowOn);
    mockOfferCalls(mockResponses.customerOffers, mockResponses.offersInfo);
    cy.visit('/subscribe/checkout/purchase/satellite/targeted?radioid=00AG&act=10000209100&programcode=3FOR1AAPYP');
});
Then(/^they should be redirected to the active subscription found page$/, () => {
    cy.url().should('contain', 'subscribe/checkout/purchase/satellite/targeted/active-subscription');
});
And(/^the subscription summary should include the renewal date$/, () => {
    cy.get('#subscriptionSummary').should('contain', 'Renews');
});

Given(/^a customer with an existing active subscription with follow on visits the page with the program code 3FOR1AAPYP$/, () => {
    cy.route('POST', '**/account/non-pii', mockResponses.nonPiiExistingSelfPay);
    mockOfferCalls(mockResponses.customerOffers, mockResponses.offersInfo);
    cy.visit('/subscribe/checkout/purchase/satellite/targeted?radioid=00AH&act=10000209100&programcode=3FOR1AAPYP');
});
Then(/^the subscription summary should not include the renewal date$/, () => {
    cy.get('#subscriptionSummary').should('not.contain', 'Renews');
});

Given(/^a customer visits the page with a program code that is not 3FOR1AAPYP or 3FOR1SELPYP or 3FOR1MMPYP$/, () => {
    const queryParamsAsString = 'radioid=00AG&act=10000209100&programcode=6FOR30AA';
    cy.wrap(queryParamsAsString).as('inboundQueryParams');
    cy.visit(`/subscribe/checkout/purchase/satellite/targeted?${queryParamsAsString}`);
});
Given(/^a customer visits the page with an upcode$/, () => {
    const queryParamsAsString = 'radioid=00AG&act=10000209100&programcode=3FOR1AAPYP&upcode=TEST';
    cy.wrap(queryParamsAsString).as('inboundQueryParams');
    cy.visit(`/subscribe/checkout/purchase/satellite/targeted?${queryParamsAsString}`);
});
Given(/^a customer visits the page with an promocode$/, () => {
    const queryParamsAsString = 'radioid=00AG&act=10000209100&programcode=3FOR1AAPYP&promocode=TEST';
    cy.wrap(queryParamsAsString).as('inboundQueryParams');
    cy.visit(`/subscribe/checkout/purchase/satellite/targeted?${queryParamsAsString}`);
});
Then(/^they should be redirected to the legacy targeted checkout URL with the query params persisted$/, () => {
    cy.get('@inboundQueryParams').then((queryParamsAsString) => {
        cy.url().should('contain', 'subscribe/checkout').should('contain', queryParamsAsString);
    });
});

Given(/^a customer visits the page with an invalid account number$/, () => {
    cy.route({ method: 'POST', url: `**/account/non-pii`, status: 400, response: {} });
    const queryParamsAsString = 'radioid=00AG&act=0000&programcode=3FOR1AAPYP';
    cy.wrap(queryParamsAsString).as('inboundQueryParams');
    cy.visit(`/subscribe/checkout/purchase/satellite/targeted?${queryParamsAsString}`);
});
Given(/^a customer visits the page with an invalid token$/, () => {
    cy.route({ method: 'POST', url: `**/account/non-pii`, status: 400, response: {} });
    const queryParamsAsString = 'tkn=INVALID&programcode=3FOR1AAPYP';
    cy.wrap(queryParamsAsString).as('inboundQueryParams');
    cy.visit(`/subscribe/checkout/purchase/satellite/targeted?${queryParamsAsString}`);
});
Then(/^they should be redirected to the legacy organic checkout URL$/, () => {
    cy.route('POST', '**/offers', mockResponses.legacyCheckoutOffers);
    cy.route('POST', '**/offers/renewal', mockResponses.legacyCheckoutRenewals);
    cy.route('POST', '**/offers/info', mockResponses.legacyCheckoutOffersInfo);
    cy.url().should('contain', 'subscribe/checkout/flepz');
});
