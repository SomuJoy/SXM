import { assertUrlDoesNotMatch, assertUrlPathMatch, servicesUrlPrefix } from '@de-care/shared/e2e';
import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { fillOutPaymentInfoForm, isEligibleFixture, rtdFixtures, selectFollowOn } from '../rtd-helpers';

Before(() => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
    rtdFixtures();
});

Given('a customer enters the RTD streaming tokenized flow', () => {
    cy.visit('/subscribe/trial/streaming/tokenized?programcode=USTPSRTD3MOFREE&tkn=1234567890');
});

And('the customer has a valid token', () => {
    cy.route('POST', `${servicesUrlPrefix}/account/token/streaming`, require('../../../../../fixtures/features/smoke-tests/rtd-streaming/account-token-streaming.json')).as(
        'accountToken'
    );
    assertUrlPathMatch('tkn=');
});

When('the customer already has an account', () => {
    cy.route(
        'POST',
        `${servicesUrlPrefix}/account/token/streaming`,
        require('../../../../../fixtures/features/smoke-tests/rtd-streaming/account-token-streaming-has-account.json')
    ).as('accountToken');
    cy.route('POST', `${servicesUrlPrefix}/identity/customer/email`, require('../../../../../fixtures/features/smoke-tests/rtd-streaming/identify-customer-email.json')).as(
        'accountSubscriptions'
    );
});

Then('the system should redirect the customer to the organic RTD flow and display the active subscriptions modal', () => {
    cy.wait('@accountToken').should((xhr) => {
        expect(xhr['status']).to.eq(200);
        expect(xhr.response.body.data.hasAccount).to.eq(true);
    });
    assertUrlPathMatch('/subscribe/trial/streaming?programcode=USTPSRTD3MOFREE');
    cy.get('[data-e2e="accountLookupSubscriptions"]').should('be.visible');
    cy.wait('@accountSubscriptions').should((xhr) => {
        expect(xhr['status']).to.eq(200);
        expect(xhr.response.body.data.length).to.be.greaterThan(0);
    });
});

Then('the customer selects a follow on and enters their information', () => {
    cy.get('[data-e2e="sxmUIPassword"]').type('Friday@5');
    selectFollowOn();
    fillOutPaymentInfoForm();
});

And('the user is eligible for the offer', () => {
    isEligibleFixture(true).as('eligibility');
    cy.get('[data-e2e="ConfirmationButton"]').click({ force: true });
    cy.get('[data-e2e="sxmUiLoadingWithAlertMessageComponent"]').should('not.exist');
    cy.wait('@eligibility').should((xhr) => {
        expect(xhr['status']).to.equal(200);
        expect(xhr.response.body.data.isEligible).to.equal(true);
    });
    cy.get('[data-e2e="sxmUiLoadingWithAlertMessageComponent"]').should('not.exist');
});

Then('the user should be able to successfully complete their purchase', () => {
    cy.get('[data-e2e="chargeAgreementCheckbox"]').check({ force: true });
    cy.get('[data-e2e="subscribePage.orderSubmitButton"]').click({ force: true });
    assertUrlPathMatch('/subscribe/trial/streaming/tokenized/thanks');
    cy.get('[data-e2e="sxmUiAlertPill"]').should('not.exist');
    cy.get('[data-e2e="satelliteStreamingPurchasePage.assistanceMessage"]').should('not.exist');
});

And('the user is ineligible for the offer', () => {
    isEligibleFixture(false).as('eligibility');
    cy.route(
        'POST',
        `${servicesUrlPrefix}/offers/customer`,
        require('../../../../../fixtures/features/smoke-tests/checkout-streaming-plan-organic/consumption-logic-eligibility-check/customer-offers-for-plan-code-after-payment-info.json')
    ).as('offerAfterEligibility');
    cy.get('[data-e2e="ConfirmationButton"]').click({ force: true });
    cy.get('[data-e2e="sxmUiLoadingWithAlertMessageComponent"]').should('be.visible');
    cy.wait('@eligibility').should((xhr) => {
        expect(xhr['status']).to.equal(200);
        expect(xhr.response.body.data.isEligible).to.equal(false);
    });
    cy.wait('@offerAfterEligibility').should((xhr) => {
        expect(xhr['status']).to.equal(200);
    });
});

Then('the user should be redirected to checkout with fallbackOffersLoaded query param set to true', () => {
    cy.get('[data-e2e="sxmUiLoadingWithAlertMessageComponent"]').should('not.exist');
    assertUrlPathMatch('/subscribe/checkout/streaming');
    cy.get('[data-e2e="sxmUiAlertPill"]').should('be.visible');
    cy.get('[data-e2e="satelliteStreamingPurchasePage.assistanceMessage"]').should('be.visible');
});

When('the customer enters a valid password and clicks start my trial button', () => {
    cy.get('[data-e2e="sxmUIPassword"]').type('Friday@5');
});

Then('the user should be able to successfully start their trial', () => {
    assertUrlPathMatch('/subscribe/trial/streaming/tokenized/thanks');
    cy.get('[data-e2e="sxmUiAlertPill"]').should('not.exist');
    cy.get('[data-e2e="satelliteStreamingPurchasePage.assistanceMessage"]').should('not.exist');
});

Given('a customer enters the RTD streaming tokenized flow without a token', () => {
    cy.visit('/subscribe/trial/streaming/tokenized?programcode=USTPSRTD3MOFREE');
});

And('the customer does not have a tkn query param in the url', () => {
    assertUrlDoesNotMatch('tkn=');
});

Then('the user is redirected to the RTD organic streaming flow', () => {
    assertUrlPathMatch('/subscribe/trial/streaming?programcode=USTPSRTD3MOFREE');
});

Given('a customer attempts to enter the RTD streaming tokenized flow', () => {
    cy.visit('/subscribe/trial/streaming/tokenized');
});

When('the url does not contain a promoCode or programCode query param', () => {
    assertUrlDoesNotMatch('promoCode=');
    assertUrlDoesNotMatch('programCode=');
});

Then('the user should be redirected to organic checkout', () => {
    assertUrlPathMatch('/subscribe/checkout/streaming');
});
