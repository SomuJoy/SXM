import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, sxmCheckPageLocation, sxmCheckParams } from '@de-care/shared/e2e';
import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import {
    paymentConfirmationButtonClick,
    useMySavedVisaSelect,
    chargeAgreementCheckboxCheck,
    acMethodClick,
    addVehicleButtonClick,
    fillOutSecurityQuestion,
    firstPlanSelect,
    packageSelectContinueButtonClick,
    // portGoToMyAccountButtonClick,
    reviewCompleteOrderButtonClick,
    scMethodClick,
    scMethodRemoveFromAccountClick,
    // streamingPlayerLinkClick,
    serivePortabilityComplete,
} from '../helpers';
import {
    mockRoutesForACTokenizedFailureAlreadyConsolidatedAndHasFollown,
    mockRoutesForACTokenizedFailureAlreadyConsolidatedAndNoFollown,
    mockRoutesForACTokenizedSuccess,
    mockRoutesForSPTokenizedSuccess,
} from './helpers';

export const mockResponses = {
    registration: require('../../../../../fixtures/features/smoke-tests/checkout/checkout-satellite-plan-targeted-pyp-reactive/registration.json'),
};

const TOKEN = '1fff6fb7-9715-4f64-aed0-568b10a6d580';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

Given('A customer qualifies for ACSC', () => {
    mockRoutesForACTokenizedSuccess();
});

Given('Already Consolidated and No follown', () => {
    mockRoutesForACTokenizedFailureAlreadyConsolidatedAndNoFollown();
});

Given('Already Consolidated and Has follown', () => {
    mockRoutesForACTokenizedFailureAlreadyConsolidatedAndHasFollown();
});

Given('A customer qualifies for SP', () => {
    mockRoutesForSPTokenizedSuccess();
});

When('they navigate through tokenized ACSC', () => {
    cy.visit(`/transfer/radio?token=${TOKEN}`);
});

When('they navigate through tokenized AC', () => {
    cy.visit(`/transfer/radio?token=${TOKEN}&mode=AC`);
});

When('they navigate through tokenized SC', () => {
    cy.visit(`/transfer/radio?token=${TOKEN}&mode=SC`);
});

Then('they should see ACSC page', () => {
    sxmCheckPageLocation('/transfer/radio');
    sxmCheckParams(`token=${TOKEN}`);
    cy.sxmWaitForSpinner();
});

Then('they should see AC page', () => {
    sxmCheckPageLocation('/transfer/radio');
    sxmCheckParams(`token=${TOKEN}&mode=AC`);
    cy.sxmWaitForSpinner();
});

Then('they should see SC page', () => {
    sxmCheckPageLocation('/transfer/radio');
    sxmCheckParams(`token=${TOKEN}&mode=SC`);
    cy.sxmWaitForSpinner();
});

Then('they should see Already Consolidated With Follown page', () => {
    sxmCheckPageLocation('/transfer/radio/consolidated');
    sxmCheckParams(``);
});

Then('they should see Already Consolidated No Follown page', () => {
    sxmCheckPageLocation('/transfer/radio/consolidated-offer');
    sxmCheckParams(``);
});

And('Just add my new car to my accont', () => {
    addVehicleButtonClick();

    cy.get('#step1-2', { timeout: 50000 }).should('be.visible');

    firstPlanSelect();
    packageSelectContinueButtonClick();

    useMySavedVisaSelect();
    paymentConfirmationButtonClick();

    chargeAgreementCheckboxCheck();
    reviewCompleteOrderButtonClick();
});

When('the customer successfully completes a transfer', () => {
    serivePortabilityComplete(false);
});

When('the customer successfully completes a transfer with remove care from account', () => {
    serivePortabilityComplete(true);
});

Then('they should see SP complete page', () => {
    sxmCheckPageLocation('/transfer/radio/port/thanks');
});

// When('they click streamming player link', () => {
//     streamingPlayerLinkClick();
// })

And('select AC mode', () => {
    acMethodClick();
});

And('select SP mode', () => {
    scMethodClick();
});

And('I no longer own this vehicle.', () => {
    scMethodRemoveFromAccountClick();
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
