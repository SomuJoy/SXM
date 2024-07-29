import { assertRTCFollowOnPlanNotAvaliableError, identify, mockCustomerOfferedRTCNotEligibleForChoice } from '@de-care/de-care-use-cases/roll-to-choice/e2e';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges } from '@de-care/shared/e2e';
import { Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

Given('Customer has a choice offer in Direct mail or targeted link but they are NOT eligible for choice package.', () => {
    mockCustomerOfferedRTCNotEligibleForChoice();
    cy.visit('/subscribe/checkout/renewal/flepz?programcode=3FOR2AATXRTC&renewalCode=CHOICE');
});

When('When they click on the link to purchase the offer or identifies themselves using account info in DM flow', () => {
    identify();
});

Then('Then they should be presented with an error message on the grid with MM select AA follow options in the grid.', () => {
    assertRTCFollowOnPlanNotAvaliableError();
});
