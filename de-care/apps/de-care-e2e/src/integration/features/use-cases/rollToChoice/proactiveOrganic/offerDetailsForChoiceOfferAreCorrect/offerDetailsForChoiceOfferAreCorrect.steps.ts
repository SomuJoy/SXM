import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, sxmCheckPageLocation } from '@de-care/shared/e2e';
import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import {
    checkIfOfferDetailsAreForChoice,
    identifyAndSubmit,
    mockRoutesForChoiceFollowOnSelectedInPlanGrid,
    RTCSelectOptionEnum,
    selectRTCSelectionOption,
    stepThroughPaymentAccordion
} from '@de-care/de-care-use-cases/roll-to-choice/e2e';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

Given('Customer has a choice offer in organic and they are eligible for choice', () => {
    mockRoutesForChoiceFollowOnSelectedInPlanGrid();
    cy.visit('/subscribe/checkout/renewal/flepz?programcode=3FOR2AATXRTC&renewalCode=CHOICE');
});

When('they select choice from the plan grid', () => {
    sxmCheckPageLocation('/subscribe/checkout/renewal/flepz');
    selectRTCSelectionOption(RTCSelectOptionEnum.CHOICE);
});

Then('they see the correct offer details', () => {
    checkIfOfferDetailsAreForChoice();
});

And('they identify and are presented the plan grid', () => {
    identifyAndSubmit();
});

Then('they see the correct offer details', () => {
    checkIfOfferDetailsAreForChoice();
});

And('they continue to checkout', () => {
    stepThroughPaymentAccordion();
});

Then('they see the correct offer details', () => {
    checkIfOfferDetailsAreForChoice();
});
