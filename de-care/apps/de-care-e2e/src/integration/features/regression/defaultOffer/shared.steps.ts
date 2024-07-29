import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges } from '@de-care/shared/e2e';
import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('a satellite customer', () => {
    cy.server();
    mockRouteForAllPackageDescriptions();
    mockRouteForCardBinRanges();
});
