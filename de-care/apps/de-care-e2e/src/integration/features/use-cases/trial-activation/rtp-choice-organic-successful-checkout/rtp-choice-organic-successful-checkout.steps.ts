import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';
import { mockRoutesForCustomerRTPSuccessfullyPurchasesChoiceAndCreatesNewAccount } from '@de-care/de-care-use-cases/trial-activation/e2e';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, sxmEnsureNoMissingTranslations } from '@de-care/shared/e2e';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

Given('the customer visits the url organic', () => {
    mockRoutesForCustomerRTPSuccessfullyPurchasesChoiceAndCreatesNewAccount();
    cy.visit(
        '/activate/trial/rtp?radioId=9586&usedCarBrandingType=OTHERS&programCode=SA3FOR2AARTC&redirectUrl=http%3A%2F%2Fhudson.corp.siriusxm.com%3A4205%2F%3Fprogramcode%3DSA3FOR2AARTC'
    );
});

When('they verify their radio ID and select a choice package', () => {
    sxmEnsureNoMissingTranslations();
});

Then('they should be able to successfully create an account and checkout', () => {});
