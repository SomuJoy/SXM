import { assertUrlPathMatch, servicesUrlPrefix } from '@de-care/shared/e2e';
import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

function submit(is2FANeeded: boolean) {
    cy.route(
        'POST',
        `${servicesUrlPrefix}/purchase/new-account`,
        is2FANeeded
            ? require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic/purchase-new-account-needs-two-factor-authentication.json')
            : require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic/purchase-new-account.json')
    );
    cy.route('POST', `${servicesUrlPrefix}/account/non-pii`, require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic/non-pii.json'));
    cy.route(
        'GET',
        `${servicesUrlPrefix}/utility/security-questions`,
        require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic/security-questions.json')
    );
    cy.route('POST', `${servicesUrlPrefix}/account/auth-verify-options`, require('../../../../../fixtures/features/smoke-tests/checkout/auth-verify-options.json'));

    cy.get('[data-e2e="chargeAgreementCheckbox"]').check({ force: true });
    cy.get('[data-e2e="reviewOrder.completeButton"]').click({ force: true });
}

function register() {
    cy.route('POST', `${servicesUrlPrefix}/account/register`, require('../../../../../fixtures/features/smoke-tests/checkout/account-register.json'));

    cy.get('[data-e2e="security.answer1"]').type('test', { force: true });
    cy.get('[data-e2e="security.question1"]')
        .first()
        .click({ force: true });
    cy.get('ul#droplist')
        .first()
        .children('li')
        .eq(1)
        .click({ force: true });

    cy.get('[data-e2e="security.question2"]')
        .first()
        .click({ force: true });
    cy.get('[data-e2e="security.answer2"]').type('test', { force: true });
    cy.get('ul#droplist')
        .eq(1)
        .children('li')
        .eq(2)
        .click({ force: true });

    cy.get('[data-e2e="security.question3"]')
        .first()
        .click({ force: true });
    cy.get('[data-e2e="security.answer3"]').type('test', { force: true });
    cy.get('ul#droplist')
        .eq(2)
        .children('li')
        .eq(3)
        .click({ force: true });

    cy.get('[data-e2e="register.button"]').click({ force: true });
}

function authenticate() {
    cy.route('POST', `${servicesUrlPrefix}/authenticate/verify-pii-data`, require('../../../../../fixtures/features/smoke-tests/checkout/verify-pii-data.json'));
    cy.get('[data-e2e="sxmUITextFormField"]').type('990005657801');
    cy.get('[data-e2e="verifyOptionsForm.continueButton"]').click({ force: true });
}

function getToPaymentStepAndFillOut() {
    cy.route('POST', `${servicesUrlPrefix}/account/token`, require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-targeted/token.json'));
    cy.route(
        'POST',
        `${servicesUrlPrefix}/offers`,
        require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic/consumption-logic-eligibility-check/organic-offers-for-program-code.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/offers/info`,
        require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic/consumption-logic-eligibility-check/organic-offers-info-for-program-code.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/offers/customer`,
        require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic/consumption-logic-eligibility-check/customer-offers-for-program-code-after-identification.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/offers/upsell`,
        require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic/consumption-logic-eligibility-check/customer-offers-upsell-for-program-code-after-identification.json')
    );
    cy.route('POST', `${servicesUrlPrefix}/check-eligibility/captcha`, require('../../../../../fixtures/features/smoke-tests/checkout/captcha.json'));

    // fill out email/password and submit
    cy.get('[data-e2e="FlepzFirstNameTextfield"]').type('Mike', { force: true });
    cy.get('[data-e2e="FlepzLastNameTextfield"]').type('Test', { force: true });
    cy.get('[data-e2e="FlepzPhoneNumberTextfield"]').type('8052222222', { force: true });
    cy.get('[data-e2e="CCAddress"]')
        .first()
        .type('1234 Block', { force: true });
    cy.get('[data-e2e="CCCity"]')
        .first()
        .type('Beverly Hills', { force: true });
    cy.get('[data-e2e="CCState"]')
        .first()
        .contains('CA')
        .click({ force: true });
    cy.get('[data-e2e="CCZipCode"]')
        .first()
        .type('90210', { force: true });
    cy.get('[data-e2e="CCNameOnCardTextfield"]').type('Mike Test', { force: true });
    cy.get('[data-e2e="CCCardNumberTextfield"]').type('4111111111111111', { force: true });
    cy.get('[data-e2e="ccExpDateOnCardTextfield"]').type('02/30', { force: true });
    cy.get('[data-e2e="ccCVV"]').type('123', { force: true });
    cy.sxmMockAddressesAndCCValidationSuccess();
    cy.sxmMockEmailIdentityValidationSuccess();
    cy.sxmMockPasswordValidationSuccess();
    cy.sxmMockEmailValidationSuccess();
    cy.get('[data-e2e="CreateLoginEmailTextfield"]').type('mytest@siriusxm.com', { force: true });
    cy.get('[data-e2e="sxmUIPassword"]')
        .type('ABCabc123!', { force: true })
        .blur();
    cy.sxmMockAddressesAndCCValidationSuccess();
}

Before(() => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
});

Given('a customer goes through the targeted streaming purchase steps', () => {
    cy.visit('/subscribe/checkout/streaming?tkn=123456890');
    getToPaymentStepAndFillOut();
});

When('the customer gets to the review and submit step', () => {});

And('clicks on the continue button', () => {
    cy.route(
        'POST',
        `${servicesUrlPrefix}/check-eligibility/streaming`,
        require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic/consumption-logic-eligibility-check/check-eligibility-streaming-is-not-eligible.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/offers/customer`,
        require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic/consumption-logic-eligibility-check/customer-offers-for-plan-code-after-payment-info.json')
    ).as('offerAfterEligibility');
    cy.route(
        'POST',
        `${servicesUrlPrefix}/offers/info`,
        require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic/consumption-logic-eligibility-check/customer-offers-info-for-plan-code-after-payment-info.json')
    ).as('offerInfoAfterEligibility');
    cy.route(
        'POST',
        `${servicesUrlPrefix}/quotes/quote`,
        require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic/consumption-logic-eligibility-check/quote-for-not-eligible-scenario.json')
    );
    cy.get('[data-e2e="PaymentConfirmationButton"]').click({ force: true });
});

Then('they should be presented with the overlay for finding another offer', () => {
    cy.get('[data-e2e="sxmUiLoadingWithAlertMessageComponent"]').should('be.visible');
});

And('the selected offer should change to the fallback offer found', () => {
    cy.wait(5000);
    cy.get('[data-e2e="sxmUiLoadingWithAlertMessageComponent"]').should('not.exist');
    cy.get('[data-e2e="streamingTargetedPurchaseStepEditButton"]').should('not.exist');
    cy.wait(1000);
    cy.get('[data-e2e="sxmUiAlertPill"]').should('be.visible');
    cy.get('[data-e2e="satelliteStreamingPurchasePage.assistanceMessage"]').should('be.visible');
});

Then('clicks on the payment confirmation button', () => {
    cy.route(
        'POST',
        `${servicesUrlPrefix}/check-eligibility/streaming`,
        // tslint:disable-next-line:max-line-length
        require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic/consumption-logic-eligibility-check/check-eligibility-streaming-is-eligible.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/quotes/quote`,
        require('../../../../../fixtures/features/smoke-tests/checkout/checkout-streaming-plan-organic/consumption-logic-eligibility-check/quote-for-eligible-scenario.json')
    );
    cy.get('[data-e2e="PaymentConfirmationButton"]').click({ force: true });
    cy.get('[data-e2e="sxmUiLoadingWithAlertMessageComponent"]').should('not.exist');
    cy.get('[data-e2e="streamingTargetedPurchaseStepEditButton"]').should('exist');
});

Then('they should be able to successfully complete their purchase', () => {
    submit(false);
    assertUrlPathMatch('/subscribe/checkout/thanks');
});

Then('they should be able to successfully complete their purchase even though 2FA required', () => {
    submit(true);
    assertUrlPathMatch('/subscribe/checkout/thanks');
});

And('Register their account on the confirmation page', () => {
    register();
});

Then('authenticate via two-factor authentication', () => {
    authenticate();
});
