import {
    identifyAndSubmit,
    mockRoutesForChoiceFollowOnSelectedInPlanGrid,
    clickContinueOnChoiceGenreForm,
    assertChoiceGenreSelectionFormErrorVisible,
    selectRTCSelectionOption,
    RTCSelectOptionEnum
} from '@de-care/de-care-use-cases/roll-to-choice/e2e';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, sxmCheckPageLocation } from '@de-care/shared/e2e';
import { Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

Given('Customer has selected Choice from the grid and they are on Choose your genre step', () => {
    mockRoutesForChoiceFollowOnSelectedInPlanGrid();
    cy.visit('/subscribe/checkout/renewal/flepz?programcode=3FOR2AATXRTC&renewalCode=CHOICE');
    sxmCheckPageLocation('/subscribe/checkout/renewal/flepz');
    selectRTCSelectionOption(RTCSelectOptionEnum.CHOICE);
});

When('they click continue on choose your genre without selecting any option', () => {
    identifyAndSubmit();
    clickContinueOnChoiceGenreForm();
});

Then('they should be presented with an error message Pick a genre below. under Choose your genre step.', () => {
    assertChoiceGenreSelectionFormErrorVisible();
});
