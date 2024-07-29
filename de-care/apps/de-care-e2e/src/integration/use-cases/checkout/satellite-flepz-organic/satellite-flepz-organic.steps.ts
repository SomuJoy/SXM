import { mockRouteForCardBinRanges, mockRouteForAllPackageDescriptions } from '@de-care/shared/e2e';
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('a customer lands on checkout organically', () => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

When('they identify successfully', () => {});

Then('they should be able to purchase a plan for their account', () => {});
