import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, sxmCheckPageLocation, sxmCheckParams } from '@de-care/shared/e2e';
import { And, Given, When } from 'cypress-cucumber-preprocessor/steps';
import {
    checkAdSupportedTierOneClickConfirmationPage,
    checkInternalServerError,
    mockRoutesForAdSupportedTierOneClickFailure,
    mockRoutesForAdSupportedTierOneClickSuccess
} from '@de-care/de-care-use-cases/trial-activation/e2e';

Given('A customer looking for activate the ad supported tier', () => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
    mockRoutesForAdSupportedTierOneClickSuccess();
});

When('they hit LAST url', () => {
    cy.visit('/activate/trial/ast?token=45834f85-1201-4d6d-b21c-ff0b9f570d84');
    sxmCheckPageLocation('/activate/trial/ast');
    sxmCheckParams('token=45834f85-1201-4d6d-b21c-ff0b9f570d84');
});

And('they should see LAST confirmation page', () => {
    sxmCheckPageLocation('/activate/trial/ast/ast-activated');
    cy.sxmWaitForSpinner();
    checkAdSupportedTierOneClickConfirmationPage();
});

Given('An already activated customer looking for activating the ad supported tier', () => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
    mockRoutesForAdSupportedTierOneClickFailure();
});

And('they should see core error 500 page', () => {
    cy.sxmWaitForSpinner();
    sxmCheckPageLocation('/error');
    checkInternalServerError();
});
