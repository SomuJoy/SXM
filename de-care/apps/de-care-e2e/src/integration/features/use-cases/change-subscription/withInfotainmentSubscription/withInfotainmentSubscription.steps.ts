import {
    clickEditOnInfotainmentStep,
    confirmBundleInfotainmentPackageExists,
    confirmCurrentSubscriptionInfoContainsInfotainment,
    confirmInactiveInfotainmentStepContainsInfotainmentPackageSelected,
    confirmInactiveInfotainmentStepDoesNotContainInfotainmentPackage,
    confirmIndividualInfotainmentPackageIsNotSelected,
    confirmInfotainmentStepExists,
    confirmOrderSummaryContainsInfotainmentLineItem,
    confirmOrderSummaryDoesNotContainInfotainmentLineItem,
    mockRoutesForDeclineInfotainmentPackageOptionsFullTransaction,
    mockRoutesForExistingSubscriptionWithInfotainmentFullTransaction,
    mockRoutesForInfotainmentPackageOptionsFullTransaction,
    selectAudioPackageAndSubmit,
    selectBillingTermAndSubmit,
    selectBundleInfotainmentPackage,
    selectIndividualInfotainmentPackage,
    selectIndividualInfotainmentPackages,
    selectPackageWithInfotainmentAndSubmit,
    selectPaymentMethodAndSubmit,
    submitInfotainmentStep,
    submitOrder
} from '@de-care/de-care-use-cases/change-subscription/e2e';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, sxmCheckPageLocation, sxmWaitForSpinner } from '@de-care/shared/e2e';
import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

Given('a customer has an existing subscription with infotainment', () => {
    mockRoutesForExistingSubscriptionWithInfotainmentFullTransaction();
    cy.wrap('10000209434').as('subscriptionId');
});
Given('a customer qualifies for offers with infotainment', () => {
    mockRoutesForInfotainmentPackageOptionsFullTransaction();
    cy.wrap('10000201036').as('subscriptionId');
});
Given('a customer qualifies for offers with infotainment bundle', () => {
    mockRoutesForInfotainmentPackageOptionsFullTransaction();
    cy.wrap('10000201036').as('subscriptionId');
});
Given('a customer qualifying for offers with infotainment does not want to take one', () => {
    mockRoutesForDeclineInfotainmentPackageOptionsFullTransaction();
    cy.wrap('10000209434').as('subscriptionId');
});

When('they navigate to the change subscription URL', () => {
    cy.get('@subscriptionId').then(subscriptionId => {
        cy.visit(`/subscription/change?subscriptionId=${subscriptionId}`);
        sxmWaitForSpinner();
    });
});

// Scenario: Customer with existing infotainment subscription
Then('they should see info about their existing infotainment plan', () => {
    confirmCurrentSubscriptionInfoContainsInfotainment('Travel');
});

// Scenario: Package options include ones with infotainment
Then('they should see a step for choosing an infotainment package', () => {
    confirmInfotainmentStepExists();
    selectAudioPackageAndSubmit();
});
And('the infotainment step should present optional choices for the infotainment packages', () => {
    selectPackageWithInfotainmentAndSubmit();
});

// Scenario: Infotainment offers include one with bundle
Then('they should see an optional choice for an infotainment package bundle', () => {
    selectAudioPackageAndSubmit();
    confirmBundleInfotainmentPackageExists();
});
And('they select an individual infotainment package', () => {
    selectIndividualInfotainmentPackage();
});
And('then they select a bundle infotainment package', () => {
    selectBundleInfotainmentPackage();
});
Then('the individual infotainment package should be deselected', () => {
    confirmIndividualInfotainmentPackageIsNotSelected();
});
And('they select all individual infotainment packages', () => {
    selectIndividualInfotainmentPackages();
});
Then('the bundle infotainment package should be selected instead of the individual packages', () => {
    confirmIndividualInfotainmentPackageIsNotSelected();
});

// Scenario: Customer chooses to not take an infotainment package
And('they click continue on the infotainment package step without selecting a package', () => {
    selectAudioPackageAndSubmit();
    submitInfotainmentStep();
});
Then('they should not see any infotainment package in the inactive step', () => {
    confirmInactiveInfotainmentStepDoesNotContainInfotainmentPackage();
});
And('the order summary should not contain a line item for the infotainment package', () => {
    selectBillingTermAndSubmit();
    selectPaymentMethodAndSubmit();
    confirmOrderSummaryDoesNotContainInfotainmentLineItem();
});

// Scenario: Customer chooses to take an infotainment package
And('they select an infotainment package and click continue', () => {
    selectAudioPackageAndSubmit();
    selectPackageWithInfotainmentAndSubmit();
});
Then('they should see the infotainment package they selected in the inactive step', () => {
    confirmInactiveInfotainmentStepContainsInfotainmentPackageSelected();
});
And('they should be able to edit the infotainment step and change their selected infotainment package', () => {
    clickEditOnInfotainmentStep();
    selectBundleInfotainmentPackage();
    submitInfotainmentStep();
});
And('the order summary should contain a line item for the infotainment package', () => {
    selectBillingTermAndSubmit();
    selectPaymentMethodAndSubmit();
    confirmOrderSummaryContainsInfotainmentLineItem();
});

And('they should be able to complete the change subscription transaction', () => {
    submitOrder();
    sxmCheckPageLocation('/subscription/change/thanks');
});
