import { Given, When, Then, Before, And } from 'cypress-cucumber-preprocessor/steps';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, sxmCheckPageLocation } from '@de-care/shared/e2e';
import {
    mockRoutesForChangePlanSuccess,
    selectBillingTermOptionAndSubmit,
    selectCancelReasonAndSubmit,
    selectChangePlanOptionAndSubmit,
    selectUseExistingCardPaymentMethodAndSubmit,
    submitReviewAndSubmitStep
} from '@de-care/de-care-use-cases/cancel-subscription/e2e';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

Given('a customer is willing to accept a save offer', () => {
    mockRoutesForChangePlanSuccess();
});

When('they navigate to the cancel online URL', () => {
    cy.visit(`/subscription/cancel?accountNumber=10000189278&subscriptionId=10000191198`);
});

And('they choose to take a change offer', () => {
    selectCancelReasonAndSubmit();
    selectChangePlanOptionAndSubmit(0);
    selectBillingTermOptionAndSubmit(0);
    selectUseExistingCardPaymentMethodAndSubmit();
    submitReviewAndSubmitStep();
});

Then('they should be navigated to the confirmation page', () => sxmCheckPageLocation('/subscription/cancel/thanks'));
