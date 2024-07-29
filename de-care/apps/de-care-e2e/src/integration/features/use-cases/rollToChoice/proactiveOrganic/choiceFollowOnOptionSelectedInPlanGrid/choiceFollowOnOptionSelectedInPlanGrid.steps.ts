import { assertGenreFormVisible, identifyAndSubmit, mockRoutesForChoiceFollowOnSelectedInPlanGrid } from '@de-care/de-care-use-cases/roll-to-choice/e2e';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges } from '@de-care/shared/e2e';
import { Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

Given('Customer is on the comparison RTC grid which has Choice, select and AA as follow on options.', () => {
    mockRoutesForChoiceFollowOnSelectedInPlanGrid();
    cy.visit('/subscribe/checkout/renewal/flepz?programcode=3FOR2AATXRTC&renewalCode=CHOICE');
});

When('they select Choice from the grid and continue', () => {
    identifyAndSubmit();
});

Then('they should be presented with Choose your genre selection form step where they can select the genre for choice.', () => {
    assertGenreFormVisible();
});
