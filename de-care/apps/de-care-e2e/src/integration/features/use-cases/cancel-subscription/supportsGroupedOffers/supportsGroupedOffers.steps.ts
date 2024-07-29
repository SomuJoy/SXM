import { Given, When, Then, And, Before } from 'cypress-cucumber-preprocessor/steps';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, mockRouteForEnvInfo } from '@de-care/shared/e2e';
import {
    confirmChoiceOfferPackageCardHasOptions,
    confirmSinglePackageCardForChoiceOffers,
    mockCancelAcceptChoiceStreamingFullTransaction,
    mockRouteForAccountWithPaidSubscription12MonthsAllAccess,
    mockRouteForGroupedOffersChoiceStreaming,
    selectCancelReasonAndSubmit,
    selectChoicePackageOptionAndSubmit,
    selectFirstBillingTermOptionAndSubmit,
    selectUseExistingCardPaymentMethodAndSubmit,
    submitReviewAndSubmitStep
} from '@de-care/de-care-use-cases/cancel-subscription/e2e';

Before(() => {
    cy.server();
});

Given('A customer qualifies for a grouped offer', () => {
    mockRouteForCardBinRanges();
    mockRouteForEnvInfo();
    mockRouteForAllPackageDescriptions();
    mockRouteForAccountWithPaidSubscription12MonthsAllAccess();
    mockRouteForGroupedOffersChoiceStreaming();
});

When('they they navigate to the cancel online URL', () => {
    cy.visit(`/subscription/cancel?accountNumber=10001086651&subscriptionId=10001085883`);
});

Given('A customer qualifies for a grouped offer and wants to change subscription', () => {
    mockCancelAcceptChoiceStreamingFullTransaction();
});

And('they get to the change plan step', () => {
    selectCancelReasonAndSubmit();
});
Then('they should see a single card for a grouped offer', () => {
    confirmSinglePackageCardForChoiceOffers();
});
And('the offer options should be presented within that single card', () => {
    confirmChoiceOfferPackageCardHasOptions();
});

And('they choose to change to one of the grouped offer options', () => {
    selectCancelReasonAndSubmit();
    selectChoicePackageOptionAndSubmit();
});
Then('they should be able to complete the transaction', () => {
    selectFirstBillingTermOptionAndSubmit();
    selectUseExistingCardPaymentMethodAndSubmit();
    submitReviewAndSubmitStep();
});
