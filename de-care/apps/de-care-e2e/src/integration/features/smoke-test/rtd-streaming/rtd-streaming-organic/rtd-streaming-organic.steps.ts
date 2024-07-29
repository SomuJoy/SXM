import { assertUrlDoesNotMatch, assertUrlPathMatch, servicesUrlPrefix } from '@de-care/shared/e2e';
import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps/';
import { fillOutEnterYourEmailForm, fillOutEnterYourInformationForm, fillOutPaymentInfoForm, isEligibleFixture, rtdFixtures, selectFollowOn } from '../rtd-helpers';

Before(() => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
    rtdFixtures();
});

Given('a customer enters the RTD streaming flow', () => {
    cy.visit('/subscribe/trial/streaming?programcode=USTPSRTD3MOFREE');
});

When('the user enters their information and selects a follow on', () => {
    fillOutEnterYourEmailForm();
    fillOutEnterYourInformationForm();
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
    assertUrlPathMatch('/subscribe/trial/streaming/thanks');
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

When('the customer enters their information and clicks the Start My Trial button', () => {
    fillOutEnterYourEmailForm();
    fillOutEnterYourInformationForm();
});

Then('the user should be able to successfully start their trial', () => {
    assertUrlPathMatch('/subscribe/trial/streaming/thanks');
    cy.get('[data-e2e="sxmUiAlertPill"]').should('not.exist');
    cy.get('[data-e2e="satelliteStreamingPurchasePage.assistanceMessage"]').should('not.exist');
});

Given('a customer attempts to enter the RTD streaming flow', () => {
    cy.visit('/subscribe/trial/streaming');
});

When('the url does not contain a promoCode or programCode query param', () => {
    assertUrlDoesNotMatch('promoCode=');
    assertUrlDoesNotMatch('programCode=');
});

Then('the user should be redirected to organic checkout', () => {
    assertUrlPathMatch('/subscribe/checkout/streaming');
});
