import { Given, When, And, Before, After } from 'cypress-cucumber-preprocessor/steps';
import {
    mockDefaultCallsForValidPromoCode,
    verifyValidPromoCodeAction,
    verifyError,
    typePromoCode,
    setLocalStorageOverrideForValidationRedirectUrl,
    clearLocalStorageOverrideForRflzRedirectUrl,
    mockDefaultCallsForRedeemedPromoCode,
    mockDefaultCallsForInvalidPromoCode
} from '../../../support/validate-promo-code.helpers';
import { mockRouteForAllPackageDescriptions } from '@de-care/shared/e2e';

Before(() => {
    setLocalStorageOverrideForValidationRedirectUrl().then(() => {
        cy.server();
        mockRouteForAllPackageDescriptions();
    });
});

After(() => {
    clearLocalStorageOverrideForRflzRedirectUrl();
});

Given('a user is on a page with the validate promo code widget', () => {
    cy.server();
    cy.visit('/');
    cy.get('[data-e2e="elements.tab.promo-code-validation"]').click();
});

When('user enters a valid promo code and send the form', () => {
    mockDefaultCallsForValidPromoCode();
    typePromoCode('SXM-QPNAD15ML8');
});

And('clicks on continue, page should be redirected to expected redirect url', () => {
    verifyValidPromoCodeAction();
});

When('user enters a redeemed promo code and send the form', () => {
    mockDefaultCallsForRedeemedPromoCode();
    typePromoCode('SXM-QPNKDVYAJ5');
});

And('clicks on continue, page should display expected redeemed error', () => {
    verifyError();
});

When('user enters an invalid promo code and send the form', () => {
    mockDefaultCallsForInvalidPromoCode();
    typePromoCode('invalidpromo');
});

And('clicks on continue, page should display expected invalid error', () => {
    verifyError();
});
