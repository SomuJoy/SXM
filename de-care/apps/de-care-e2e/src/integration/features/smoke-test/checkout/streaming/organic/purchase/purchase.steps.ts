import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

export const mockResponses = {
    allPackageDescriptions: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/all-package-descriptions.json'),
    updateUseCase: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/update-usecase.json'),
    offers: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/offers.json'),
    offersInfo: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/offers-info.json'),
    password: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/validate-password.json'),
    email: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/identity-email.json'),
    customerInfo: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/customer-info.json'),
    customerOffers: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/customer-offers.json'),
    offersInfo2: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/offers-info2.json'),
    fallbackCustomerOffers: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/fallback-customer-offers.json'),
    fallbackOffersInfo: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/fallback-offers-info.json'),
    fallbackQuote: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/fallback-quote.json'),
    customerInfo2: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/customer-info2.json'),
    streaming: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/streaming-eligible.json'),
    streamingIneligible: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/streaming-ineligible.json'),
    quote: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/quote.json'),
    newAccount: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/new-account.json'),
    newAccountExpiredCreditCard: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/new-account-cc-expired-error.json'),
    newAccountFraudCreditCard: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/new-account-cc-fraud-error.json'),
    newAccountSystemError: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/new-account-system-error.json'),
    newAccountPasswordError: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/new-account-password-error.json'),
    newAccountNotEligibleForRegistration: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/new-account-not-eligible-for-registration.json'),
    nonPii: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/non-pii.json'),
    securityQuestions: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/security-questions.json'),
    registration: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/registration.json'),
    emailExistingSingleStreaming: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/identity-email-existing-single-streaming.json'),
    emailExistingMultipleStreaming: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/identity-email-existing-multiple-streaming.json'),
    emailExistingSingleTrial: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/identity-email-existing-single-trial.json'),
    emailExistingMultipleTrialSomeFollowOn: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/identity-email-existing-multiple-with-and-without-followon.json'),
    captchaRequired: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/captcha-required.json'),
    captchaNotRequired: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/captcha-not-required.json'),
    newCaptcha: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/new-captcha.json'),
    validateCaptchaSuccess: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/captcha-validate-success.json'),
    validateCaptchaFail: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/captcha-validate-fail.json'),
    giftCardSuccess: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/gift-card-success.json'),
    giftCardResetSuccess: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/gift-card-reset-success.json'),
    quoteWithGiftCard: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/quote-with-gift-card.json'),
    offersFallbackDefault: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/offers-fallback-default.json'),
    offersInfoFallbackDefault: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/offers-info-fallback-default.json'),
    offersFallbackForExpired: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/offers-fallback-for-expired.json'),
    offersInfoFallbackForExpired: require('../../../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic-variant2/offers-info-fallback-for-expired.json'),
};

const routeUrlBase = '/subscribe/checkout/purchase/streaming/organic';

Before(() => {
    cy.viewport(900, 1200);
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.route('POST', '**/offers/all-package-desc', mockResponses.allPackageDescriptions);
    cy.route('POST', '**/apigateway/update-usecase', mockResponses.updateUseCase);
    cy.route('POST', '**/offers', mockResponses.offers);
    cy.route('POST', '**/offers/info', mockResponses.offersInfo);
});

Given(/^a customer visits the page with a program code for an offer no longer available$/, () => {
    cy.visit(`${routeUrlBase}?programcode=USTPSRTP3MOFREE`);
    cy.route('POST', '**/offers', mockResponses.offersFallbackDefault);
    cy.route('POST', '**/offers/info', mockResponses.offersInfoFallbackDefault);
});
Then(/^they should be presented with the no longer available finding another offer messaging before seeing a fallback offer$/, () => {
    cy.get('sxm-ui-loading-with-alert-message').should('be.visible');
    cy.get('sxm-ui-loading-with-alert-message sxm-ui-alert-pill').should('contain.text', 'available');
    cy.wait(5000).then(() => {
        cy.get('sxm-ui-primary-package-card').should('be.visible');
    });
});

Given(/^a customer visits the page with a program code for an expired offer$/, () => {
    cy.visit(`${routeUrlBase}?programcode=USTPSRTP3MOFREE`);
    cy.route('POST', '**/offers', mockResponses.offersFallbackForExpired);
    cy.route('POST', '**/offers/info', mockResponses.offersInfoFallbackForExpired);
});
Then(/^they should be presented with the finding another offer messaging before seeing a fallback offer$/, () => {
    cy.get('sxm-ui-loading-with-alert-message').should('be.visible');
    cy.get('sxm-ui-loading-with-alert-message sxm-ui-alert-pill').should('contain.text', 'expired');
    cy.wait(5000).then(() => {
        cy.get('sxm-ui-primary-package-card').should('be.visible');
    });
});

Given(/^a customer visits the page with the program code USTPSRTP3MOFREE$/, () => {
    cy.visit(`${routeUrlBase}?programcode=USTPSRTP3MOFREE`);
});
Then(/^they should be presented with the correct offer$/, () => {
    cy.get('sxm-ui-primary-package-card').should('be.visible').should('contain', 'SiriusXM Streaming Platinum');
});

Given('a customer goes through the organic streaming purchase steps with the program code USTPSRTP3MOFREE', () => {
    cy.visit(`${routeUrlBase}?programcode=USTPSRTP3MOFREE`);
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    completeTransactionFromCredentialsStep();
});

Given('a customer goes through the organic streaming purchase steps starting on credentials interstitial with the program code USTPSRTP3MOFREE', () => {
    cy.visit(`${routeUrlBase}/creds-int?programcode=USTPSRTP3MOFREE`);
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    completeTransactionFromCredentialsStep();
});

Given('a customer goes through the organic streaming purchase steps starting on credentials with the program code USTPSRTP3MOFREE', () => {
    cy.visit(`${routeUrlBase}/creds?programcode=USTPSRTP3MOFREE`);
    completeTransactionFromCredentialsStep();
});

Given(/^a customer goes through the organic streaming purchase steps using a gift card and with the program code USTPSRTP3MOFREE$/, () => {
    cy.visit(`${routeUrlBase}?programcode=USTPSRTP3MOFREE`);
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    mockSuccessfulAccountLookupCalls();
    fillOutAndSubmitAccountLookupForm();
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    mockSuccessfulPaymentInfoCalls();
    cy.route('POST', '**/payment/giftcard/info', mockResponses.giftCardSuccess);
    cy.route('POST', '**/quotes/quote', mockResponses.quoteWithGiftCard);
    fillOutPaymentInfoForm();
    cy.get('button#prepaid-btn')
        .click({ force: true })
        .then(() => {
            cy.get('input#prepaid').clear({ force: true }).type('30100000015001', { force: true });
            cy.get('prepaid-redeem-ui form button').click({ force: true });
        });
    submitPaymentForm();
    cy.get('step-organic-review-page')
        .should('be.visible')
        .then(() => {
            cy.get('step-organic-review-page quote-summary').should('contain.text', 'Gift Card');
        });
});

When('the customer successfully completes a transaction', () => {
    mockSuccessfulTransactionCalls();
    acceptAndSubmitTransaction();
});

Then('they should land on the confirmation page', () => {
    cy.url().should('contain', 'subscribe/checkout/purchase/streaming/organic/thanks');
});

Then(/^they should be able to register on the confirmation page$/, () => {
    cy.get('register-your-account form').within(() => {
        fillOutSecurityQuestion(0, 'batty');
        fillOutSecurityQuestion(1, 'baseball field');
        fillOutSecurityQuestion(2, '911');
    });
    cy.route('POST', '**/account/register', mockResponses.registration);
    cy.get('register-your-account button[sxm-proceed-button]').click({ force: true });
});

When(/^the customer successfully completes a transaction and registration is not needed$/, () => {
    cy.route('POST', '**/purchase/new-account', mockResponses.newAccountNotEligibleForRegistration);
    cy.route('POST', '**/non-pii', mockResponses.nonPii);
    acceptAndSubmitTransaction();
});
Then(/^they should not see the registration UI on the confirmation page$/, () => {
    cy.url().should('contain', 'subscribe/checkout/purchase/streaming/organic/thanks');
    cy.get('register-your-account').should('not.exist');
});

Given(/^a customer goes through the organic streaming purchase steps with the program code USTPSRTP3MOFREE and non-qualifying data$/, () => {
    cy.visit(`${routeUrlBase}?programcode=USTPSRTP3MOFREE`);
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    mockSuccessfulAccountLookupCalls();
    fillOutAndSubmitAccountLookupForm();
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    mockIneligiblePaymentInfoCalls();
    fillOutAndSubmitPaymentInfoForm();
});
Then(/^they should be presented with a fallback offer$/, () => {
    cy.wait(5000).then(() => {
        cy.get('step-organic-review-page sxm-ui-alert-pill').should('be.visible');
        cy.get('step-organic-review-page sxm-ui-plan-recap-card').should('be.visible');
    });
});

Given(/^a customer uses an email address that has a single streaming subscription when visiting the page with the program code USTPSRTP3MOFREE$/, () => {
    cy.visit(`${routeUrlBase}?programcode=USTPSRTP3MOFREE`);
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    cy.route('POST', '**/validate/password', mockResponses.password);
    cy.route('POST', '**/identity/customer/email', mockResponses.emailExistingSingleStreaming);
    fillOutAndSubmitAccountLookupForm();
});
Then(/^they should be presented with the subscription found modal and the listen link$/, () => {
    cy.get('#streamingFoundModalBodyTitle').should('be.visible');
    cy.get('#streamingFoundModal a.player-link').should('have.length', 1).should('be.visible').should('contain', 'Listen');
});

Given(/^a customer uses an email address that has multiple streaming subscriptions when visiting the page with the program code USTPSRTP3MOFREE$/, () => {
    cy.visit(`${routeUrlBase}?programcode=USTPSRTP3MOFREE`);
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    cy.route('POST', '**/validate/password', mockResponses.password);
    cy.route('POST', '**/identity/customer/email', mockResponses.emailExistingMultipleStreaming);
    fillOutAndSubmitAccountLookupForm();
});
Then(/^they should be presented with the subscription found modal and multiple listen links$/, () => {
    cy.get('#streamingFoundModalBodyTitle').should('be.visible');
    cy.get('#streamingFoundModal a.player-link').should('have.length', 2).should('be.visible').should('contain', 'Listen');
});

Given(/^a customer uses an email address that has a single trial subscription when visiting the page with the program code USTPSRTP3MOFREE$/, () => {
    cy.visit(`${routeUrlBase}?programcode=USTPSRTP3MOFREE`);
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    cy.route('POST', '**/validate/password', mockResponses.password);
    cy.route('POST', '**/identity/customer/email', mockResponses.emailExistingSingleTrial);
    fillOutAndSubmitAccountLookupForm();
});
Then(/^they should be presented with the subscription found modal and the subscribe link$/, () => {
    cy.get('#streamingFoundModalBodyTitle').should('be.visible');
    cy.get('#streamingFoundModal a.subscribe-link').should('have.length', 1).should('be.visible').should('contain', 'Subscribe');
});

Given(/^a customer uses an email address that has multiple trial subscriptions and some with follow ons when visiting the page with the program code USTPSRTP3MOFREE$/, () => {
    cy.visit(`${routeUrlBase}?programcode=USTPSRTP3MOFREE`);
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    cy.route('POST', '**/validate/password', mockResponses.password);
    cy.route('POST', '**/identity/customer/email', mockResponses.emailExistingMultipleTrialSomeFollowOn);
    fillOutAndSubmitAccountLookupForm();
});
Then(/^they should be presented with the subscription found modal and the subscribe link and listen link$/, () => {
    cy.get('#streamingFoundModalBodyTitle').should('be.visible');
    cy.get('#streamingFoundModal a.subscribe-link').should('have.length', 1).should('be.visible').should('contain', 'Subscribe');
    cy.get('#streamingFoundModal a.player-link').should('have.length', 2).should('be.visible').should('contain', 'Listen');
});

Given(/^a customer goes through the organic streaming purchase steps with the program code USTPSRTP3MOFREE and invalid credit card expiration$/, () => {
    cy.visit(`${routeUrlBase}?programcode=USTPSRTP3MOFREE`);
    getToReviewStep();
    cy.route({
        method: 'POST',
        url: '**/purchase/new-account',
        status: 400,
        response: mockResponses.newAccountExpiredCreditCard,
    });
    acceptAndSubmitTransaction();
});

Given(/^a customer goes through the organic streaming purchase steps with the program code USTPSRTP3MOFREE and invalid credit card$/, () => {
    cy.visit(`${routeUrlBase}?programcode=USTPSRTP3MOFREE`);
    getToReviewStep();
    cy.route({
        method: 'POST',
        url: '**/purchase/new-account',
        status: 400,
        response: mockResponses.newAccountFraudCreditCard,
    });
    acceptAndSubmitTransaction();
});
Then(/^they should be taken back to the payment step and shown an error message in the credit card section$/, () => {
    cy.get('step-organic-payment-page').should('be.visible');
    cy.get('#creditCardProcessingError').should('be.visible');
});

Given(/^a customer goes through the organic streaming purchase steps with the program code USTPSRTP3MOFREE and a system error occurs on purchase transaction$/, () => {
    cy.visit(`${routeUrlBase}?programcode=USTPSRTP3MOFREE`);
    getToReviewStep();
    cy.route({
        method: 'POST',
        url: '**/purchase/new-account',
        status: 400,
        response: mockResponses.newAccountSystemError,
    });
    acceptAndSubmitTransaction();
});
Then(/^they should be taken back to the payment step and shown a general system error message in the credit card section$/, () => {
    cy.get('step-organic-payment-page').should('be.visible');
    cy.get('#unexpectedProcessingError').should('be.visible');
});

Given(/^a customer goes through the organic streaming purchase steps with the program code USTPSRTP3MOFREE and captcha is required$/, () => {
    cy.visit(`${routeUrlBase}?programcode=USTPSRTP3MOFREE`);
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    mockSuccessfulAccountLookupCalls();
    fillOutAndSubmitAccountLookupForm();
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    mockSuccessfulPaymentInfoCalls();
    cy.route('POST', '**/check-eligibility/captcha', mockResponses.captchaRequired);
    cy.route('POST', '**/utility/captcha/new', mockResponses.newCaptcha);
    fillOutAndSubmitPaymentInfoForm();
});
Then(/^they should be presented with the captcha field on the review order step$/, () => {
    cy.get('step-organic-review-page #nuCaptchaFieldSection').should('be.visible');
});
And(/^they should be able to answer the captcha and submit the transaction$/, () => {
    cy.wait(1000);
    mockSuccessfulTransactionCalls();
    cy.route('POST', '**/utility/captcha/validate', mockResponses.validateCaptchaSuccess);
    cy.get('input[name="chargeAgreementAccepted"]').click({ force: true });
    cy.get('sxm-ui-nucaptcha form input[qatag="NuCaptchaTextfield"]').clear({ force: true }).type('ARZ', { force: true });
    cy.get('step-organic-review-page button[sxm-proceed-button]').click({ force: true });
    cy.url().should('contain', 'subscribe/checkout/purchase/streaming/organic/thanks');
});

Given(/^a customer goes through the organic streaming purchase steps with the program code USTPSRTP3MOFREE and a password error occurs on purchase transaction$/, () => {
    cy.visit(`${routeUrlBase}?programcode=USTPSRTP3MOFREE`);
    getToReviewStep();
    cy.route({
        method: 'POST',
        url: '**/purchase/new-account',
        status: 400,
        response: mockResponses.newAccountPasswordError,
    });
    acceptAndSubmitTransaction();
});
Then(/^they should be taken back to the credentials step and shown a password error message$/, () => {
    cy.get('step-organic-credentials-page').should('be.visible');
    cy.get('sxm-ui-password-form-field .invalid-feedback').should('be.visible');
});

/* HELPER FUNCTIONS */
const mockSuccessfulAccountLookupCalls = () => {
    cy.route('POST', '**/validate/password', mockResponses.password);
    cy.route('POST', '**/identity/customer/email', mockResponses.email);
    cy.route('POST', '**/validate/customer-info', mockResponses.customerInfo);
    cy.route('POST', '**/offers/customer', mockResponses.customerOffers);
    cy.route('POST', '**/offers/info', mockResponses.offersInfo2);
};
const fillOutAndSubmitAccountLookupForm = () => {
    cy.get('[data-e2e="sxmUIEmail"]').clear({ force: true }).type('variantperson@siriusxm.com', { force: true });
    cy.get('[data-e2e="sxmUIPasswordFormField"]').clear({ force: true }).type('asdASD23@', { force: true });
    cy.get('step-organic-credentials-page button[sxm-proceed-button]').click({ force: true });
};
const mockSuccessfulPaymentInfoCalls = () => {
    cy.route('POST', '**/validate/customer-info', mockResponses.customerInfo2);
    cy.route('POST', '**/check-eligibility/streaming', mockResponses.streaming);
    cy.route('POST', '**/check-eligibility/captcha', mockResponses.captchaNotRequired);
    cy.route('POST', '**/quotes/quote', mockResponses.quote);
};
const mockIneligiblePaymentInfoCalls = () => {
    cy.route('POST', '**/validate/customer-info', mockResponses.customerInfo2);
    cy.route('POST', '**/check-eligibility/streaming', mockResponses.streamingIneligible);
    cy.route('POST', '**/offers/customer', mockResponses.fallbackCustomerOffers);
    cy.route('POST', '**/offers/info', mockResponses.fallbackOffersInfo);
    cy.route('POST', '**/check-eligibility/captcha', mockResponses.captchaNotRequired);
    cy.route('POST', '**/quotes/quote', mockResponses.fallbackQuote);
};
const fillOutPaymentInfoForm = () => {
    cy.get('[data-e2e="BillingInfoFirstName"] input').clear({ force: true }).type('Variant', { force: true });
    cy.get('[data-e2e="BillingInfoLastName"] input').clear({ force: true }).type('Person', { force: true });
    cy.get('[data-e2e="BillingInfoPhoneNumber"] input').clear({ force: true }).type('8051111111', { force: true });
    cy.get('input[name="cc-name"]').clear({ force: true }).type('Variant Person', { force: true });
    cy.get('input[name="cc-number"]').clear({ force: true }).type('4111222233334444', { force: true });
    cy.get('input[name="cc-exp"]').clear({ force: true }).type('0230', { force: true });
    cy.get('input[name="cc-csc"]').clear({ force: true }).type('123', { force: true });
    cy.get('input[data-e2e="sxmUIPostalCodeFormField"]').clear({ force: true }).type('12345', { force: true });
};
const submitPaymentForm = () => {
    cy.get('step-organic-payment-page button[sxm-proceed-button]').click({ force: true });
};
const fillOutAndSubmitPaymentInfoForm = () => {
    fillOutPaymentInfoForm();
    submitPaymentForm();
};
const mockSuccessfulTransactionCalls = () => {
    cy.route('POST', '**/purchase/new-account', mockResponses.newAccount);
    cy.route('POST', '**/non-pii', mockResponses.nonPii);
    cy.route('GET', '**/utility/security-questions', mockResponses.securityQuestions);
};
const acceptAndSubmitTransaction = () => {
    cy.get('input[name="chargeAgreementAccepted"]').click({ force: true });
    cy.get('step-organic-review-page button[sxm-proceed-button]').click({ force: true });
};
const fillOutSecurityQuestion = (index: number, text: string) => {
    cy.get('sxm-ui-dropdown').eq(index).click({ force: true });
    cy.get('sxm-ui-dropdown')
        .eq(index)
        .within(() => {
            cy.get('[data-e2e="sxmDropDownItem"]').eq(index).click({ force: true });
        });
    cy.get(`input#regActSecAnswer${index}`).type(text, { force: true });
};

const getToReviewStep = () => {
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    mockSuccessfulAccountLookupCalls();
    fillOutAndSubmitAccountLookupForm();
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    mockSuccessfulPaymentInfoCalls();
    fillOutAndSubmitPaymentInfoForm();
};

const completeTransactionFromCredentialsStep = () => {
    mockSuccessfulAccountLookupCalls();
    fillOutAndSubmitAccountLookupForm();
    cy.get('#mainContent a[sxmUiDataClickTrack="routing"]').click({ force: true });
    mockSuccessfulPaymentInfoCalls();
    fillOutAndSubmitPaymentInfoForm();
    cy.get('step-organic-review-page')
        .should('be.visible')
        .then(() => {
            cy.get('step-organic-review-page sxm-ui-alert-pill').should('not.exist');
            cy.get('step-organic-review-page #nuCaptchaFieldSection').should('not.exist');
            cy.get('step-organic-review-page quote-summary').should('not.contain.text', 'Gift Card');
        });
};
