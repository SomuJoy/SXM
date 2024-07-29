import {
    confirmElegibleAudioStepForDataOnly,
    confirmInfotainmentStepForDataOnly,
    confirmInfotainmentStepIsNotOptional,
    confirmInfotainmentStepIsNotPresented,
    confirmInfotainmentStepIsOptional,
    confirmSkipToInfotainmentLinkIsPresented,
    mockRoutesForDataOnlySelfPay,
    mockRoutesForDataOnlyTrialNoInfotainments,
    mockRoutesForDataOnlyTrialWithFollowOn,
    mockRoutesForDataOnlyTrialWithInfotainments,
    selectAudioPackageAndSubmit,
    selectBillingTermAndSubmit,
    selectPackageWithInfotainmentAndSubmit,
    selectPaymentMethodAndSubmit,
    submitChoosePackageStep,
    submitInfotainmentStep
} from '@de-care/de-care-use-cases/change-subscription/e2e';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, sxmWaitForSpinner } from '@de-care/shared/e2e';
import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

Given('a satellite customer with a subscription that has No Audio service and only a Self-Pay Data service', () => {
    mockRoutesForDataOnlySelfPay();
    cy.wrap('10000206105').as('subscriptionId');
});

Given('a satellite customer with a subscription that has No Audio service and a Data trial with no follow-on and > 1 year left on the trial', () => {
    mockRoutesForDataOnlyTrialNoInfotainments();
    cy.wrap('10000206976').as('subscriptionId');
});

Given('a satellite customer with a subscription that has No Audio service and a Data trial with no follow-on and < 1 year left on the trial', () => {
    mockRoutesForDataOnlyTrialWithInfotainments();
    cy.wrap('10000227954').as('subscriptionId');
});

Given('a satellite customer with a subscription that has No Audio service and a Data trial with follow-on', () => {
    mockRoutesForDataOnlyTrialWithFollowOn();
    cy.wrap('10000232056').as('subscriptionId');
});

When('the customer navigates into PHX Change plan flow', () => {
    cy.get('@subscriptionId').then(subscriptionId => {
        cy.visit(`/subscription/change?subscriptionId=${subscriptionId}`);
        sxmWaitForSpinner();
    });
});

Then('they should see all Audio packages they can add to their subscription', () => {
    confirmElegibleAudioStepForDataOnly({
        expectedFirstPackage: 'SiriusXM All Access',
        expectedSecondPackage: 'SiriusXM Select'
    });
    confirmSkipToInfotainmentLinkIsPresented();
    submitChoosePackageStep();
});

Then('they should only see Audio packages they can add to their subscription, no data options displayed', () => {
    confirmInfotainmentStepIsNotPresented();
    confirmElegibleAudioStepForDataOnly({
        expectedFirstPackage: 'XM All Access',
        expectedSecondPackage: 'XM Select'
    });
    selectAudioPackageAndSubmit();
});

Then('they should see all Audio packages they can add', () => {
    confirmElegibleAudioStepForDataOnly({
        expectedFirstPackage: 'SiriusXM All Access',
        expectedSecondPackage: 'SiriusXM Select'
    });
    confirmSkipToInfotainmentLinkIsPresented();
    selectAudioPackageAndSubmit();
});

Then('they should see all Audio packages they can add to their own subscription', () => {
    confirmElegibleAudioStepForDataOnly({
        expectedFirstPackage: 'Sirius All Access',
        expectedSecondPackage: 'Sirius Select'
    });
    confirmSkipToInfotainmentLinkIsPresented();
    selectAudioPackageAndSubmit();
});

And('they should see Data packages that they can change too', () => {
    confirmInfotainmentStepForDataOnly();
    confirmInfotainmentStepIsNotOptional();
    submitInfotainmentStep();
});

And('they should see Data packages that they can add to their subscription', () => {
    confirmInfotainmentStepForDataOnly();
    confirmInfotainmentStepIsOptional();
    selectPackageWithInfotainmentAndSubmit();
});

When('they select their billing term options', () => {
    selectBillingTermAndSubmit();
});

Then('they should continue to the checkout steps', () => {
    selectPaymentMethodAndSubmit();
});
