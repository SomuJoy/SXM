import { mockCustomerDidNotSelectChoiceFromGrid, identifyAndSubmit, assertGenreFormNotVisible, RTCSelectOptionEnum } from '@de-care/de-care-use-cases/roll-to-choice/e2e';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges } from '@de-care/shared/e2e';
import { Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

Given('Customer is on the comparison RTC grid which has Choice, select and AA as follow on options.', () => {
    mockCustomerDidNotSelectChoiceFromGrid();
    cy.visit('/subscribe/checkout/renewal/flepz?programcode=3FOR2AATXRTC&renewalCode=CHOICE');
});

When('they select any other follow on option except "Choice" from the grid and continue', () => {
    identifyAndSubmit('990005142610', '10000223279', RTCSelectOptionEnum.ALL_ACCESS);
});

Then('they should be presented with payment step.', () => {
    assertGenreFormNotVisible();
});
