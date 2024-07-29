import {
    mockRoutesForCustomerSuccessfullyPurchasesChoice,
    identifyAndSubmit,
    stepThroughPaymentAccordion,
    assertAppThanksVisible,
} from '@de-care/de-care-use-cases/roll-to-choice/e2e';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges } from '@de-care/shared/e2e';
import { Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

Given('Customer has a choice offer in Direct mail or targeted link and they are eligible for choice', () => {
    mockRoutesForCustomerSuccessfullyPurchasesChoice();
    cy.visit('/subscribe/checkout/renewal/flepz?programcode=3FOR2AATXRTC&renewalCode=CHOICE');
});

When('they try to purchase the offer by completing each and every necessary step', () => {
    identifyAndSubmit();
    stepThroughPaymentAccordion();
});

Then('they should be able to purchase the offer or complete the transaction.', () => {
    assertAppThanksVisible();
});
