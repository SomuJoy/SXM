import {
    confirmFirstPackageIsPreselected,
    confirmHeaderContainsExpiredOfferError,
    confirmHeaderContainsUpgradedSubscriptionMessage,
    confirmRedirectionToBauLoginPage,
    fillOutPaymentFormEmail,
    mockRoutesForFullTokenizedChangePlan,
    mockRoutesForTokenizedChangePlanUpgradedFailure,
    mockRoutesForTokenizedChangePlanPromoFailure,
    mockRoutesForTokenizedChangePlanTokenFailure,
    selectBillingTermAndSubmit,
    selectPaymentMethodAndSubmit,
    submitChoosePackageStep,
    submitOrder
} from '@de-care/de-care-use-cases/change-subscription/e2e';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, sxmCheckPageLocation, sxmWaitForSpinner } from '@de-care/shared/e2e';
import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

Given('a customer with valid token is eligible for the upgrade', () => {
    mockRoutesForFullTokenizedChangePlan();
});

Given('a customer with valid token has already upgraded the plan', () => {
    mockRoutesForTokenizedChangePlanUpgradedFailure();
});

Given('a customer with valid token is not eligible for upgrade', () => {
    mockRoutesForTokenizedChangePlanPromoFailure();
});

Given('a customer with invalid token', () => {
    //mockRoutesForTokenizedChangePlanTokenFailure();
});

When('they navigate to the change subscription URL with tokenized link', () => {
    cy.visit('/subscription/change?tkn=83d0c4d9-5597-4086-a0b8-c1ef90aaa889&task=upgrade');
    sxmWaitForSpinner();
});

// Scenario: Customer with valid token and eligible for the upgrade
Then('they should see a step for choosing a package with the first one being preselected', () => {
    confirmFirstPackageIsPreselected();
});

// Scenario: Customer chooses to take a preselected package
And('they click continue with the preselected package', () => {
    submitChoosePackageStep();
});

And('they should be able to complete the change subscription transaction', () => {
    selectBillingTermAndSubmit();
    fillOutPaymentFormEmail();
    selectPaymentMethodAndSubmit();
    submitOrder();
    sxmCheckPageLocation('/subscription/change/thanks');
});

// Scenario: Customer with valid token has already upgraded the plan
Then('they should see the upgraded subscription header', () => {
    confirmHeaderContainsUpgradedSubscriptionMessage();
});

// Scenario: Customer with valid token and not eligible for upgrade
Then('they should see the expired offer error in the header', () => {
    confirmHeaderContainsExpiredOfferError();
});

// Scenario: Customer with invalid token
Then('they should be redirected to the BAU login page', () => {
    confirmRedirectionToBauLoginPage();
});
