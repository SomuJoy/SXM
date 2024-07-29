import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, sxmCheckPageLocation, sxmCheckParams } from '@de-care/shared/e2e';
import {
    checkAccordionStepToBeactive,
    checkForThankYouPage,
    checkMainProactiveLandingPage,
    checkSatelliteStreamingPage,
    clickAccountInfoFormContinue,
    clickChargeAgreementCheckbox,
    clickContinueRtcButton,
    clickGetReviewOrderCompleteButton,
    clickOnSubscriptionOptions,
    clickPaymentConfirmationButton,
    clickYourInfoModalContinue,
    fillAccountInfoForm,
    mockRoutesForRtcProactiveTargetedSuccess,
    mockRoutesForRtcReactiveOrganicSuccess,
    mockRoutesForRtcReactiveOrganicSuccessAfterIdentification,
    mockRoutesForRtcReactiveTargetedSuccess,
    selectCurrentBillingOption,
    selectRtcSelectionOption
} from '@de-care/de-care-use-cases/checkout/e2e';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

Given('A customer qualifies for RTC offers', () => {
    mockRoutesForRtcProactiveTargetedSuccess();
});

When('they navigate through RTC proactive targeted flow', () => {
    cy.visit('/subscribe/checkout/renewal?radioid=990005181012&act=10000204723&programcode=3FOR2AATXRTC');
});

And('they should see RTC targeted landing page', () => {
    sxmCheckPageLocation('/subscribe/checkout/renewal');
    sxmCheckParams('radioid=990005181012&act=10000204723&programcode=3FOR2AATXRTC');
    cy.sxmWaitForSpinner();
    checkMainProactiveLandingPage();
});

Then('they could select any RTC offer and click on continue', () => {
    selectRtcSelectionOption(1);
    clickContinueRtcButton();
});

And('they should be redirected to checkout targeted flow with an rtc programcode', () => {
    sxmCheckPageLocation('/subscribe/checkout');
    sxmCheckParams('act=10000204723&radioId=990005181012&programCode=3FOR2AATXRTC');
});

Given('An authenticated customer looking for RTC offers', () => {
    mockRoutesForRtcReactiveTargetedSuccess();
});

When('they navigate through RTC reactive targeted flow', () => {
    cy.visit('/subscribe/checkout?radioid=990005023611&act=10000215319&programcode=3FOR2AATXRTC');
});

Then('they should see checkout RTC targeted page', () => {
    sxmCheckPageLocation('/subscribe/checkout');
    sxmCheckParams('radioid=990005023611&act=10000215319&programcode=3FOR2AATXRTC');
    cy.sxmWaitForSpinner();
    checkSatelliteStreamingPage();
    checkAccordionStepToBeactive(0);
});

And('they could select any rtc package with a valid billing info', () => {
    clickOnSubscriptionOptions();
    selectRtcSelectionOption(1);
    clickContinueRtcButton();
    selectCurrentBillingOption();
    clickPaymentConfirmationButton();
});

Then('they should be redirected to complete review your order step', () => {
    checkAccordionStepToBeactive('last');
});

And('they could agree and continue', () => {
    clickChargeAgreementCheckbox();
    clickGetReviewOrderCompleteButton();
});

Then('they navigate to checkout Thank you page', () => {
    sxmCheckPageLocation('/subscribe/checkout/thanks');
    checkForThankYouPage();
});

Given('A customer looking for RTC offers', () => {
    mockRoutesForRtcReactiveOrganicSuccess();
});

When('they navigate through RTC reactive organic flow', () => {
    cy.visit('/subscribe/checkout/flepz?programcode=3FOR2AATXRTC&renewalCode=BASIC');
});

Then('they should see checkout RTC organic page', () => {
    sxmCheckPageLocation('/subscribe/checkout/flepz');
    sxmCheckParams('programcode=3FOR2AATXRTC&renewalCode=BASIC');
    cy.sxmWaitForSpinner();
    checkSatelliteStreamingPage();
    checkAccordionStepToBeactive(0);
});

And('they should use their account info for authenticating themselves', () => {
    fillAccountInfoForm('990003243802', '10000219646');
    clickAccountInfoFormContinue();
    mockRoutesForRtcReactiveOrganicSuccessAfterIdentification();
    clickYourInfoModalContinue();
});

Then('they should be redirected to billing information step', () => {
    checkAccordionStepToBeactive(1);
});
