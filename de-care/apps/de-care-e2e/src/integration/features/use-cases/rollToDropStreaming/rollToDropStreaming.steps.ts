import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import {
    cyGetE2ECreditCardFormFieldsCCUnexpectedErrorCopy,
    mockRouteForAllPackageDescriptions,
    mockRouteForCardBinRanges,
    mockRouteForEnvInfo,
    sxmWaitForSpinner
} from '@de-care/shared/e2e';
import { fillOutForm, mockNewAccountCreditCardFraud } from '@de-care/de-care-use-cases/roll-to-drop/e2e';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForEnvInfo();
    mockRouteForAllPackageDescriptions();
    mockNewAccountCreditCardFraud();
});

Given('I navigate to the URL', () => {
    cy.visit('/subscribe/trial/streaming?programcode=USTPSRTD3MOFREE');
    sxmWaitForSpinner();
});
When('I fill out the form with fraudulent credit card data', () => {
    fillOutForm();
});
Then('I should see the credit card error message', () => {
    cyGetE2ECreditCardFormFieldsCCUnexpectedErrorCopy().should('be.visible');
});
