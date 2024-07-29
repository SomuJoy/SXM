import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, sxmCheckPageLocation } from '@de-care/shared/e2e';
import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import {
    mockRoutesForOrganicPlatinumVipWith2EligibleRadiosSuccess,
    mockRoutesForOrganicPlatinumVipWith1EligibleRadioSuccess,
    mockRoutesForOrganicPlatinumVipWithSecondIneligibleRadio,
    mockRoutesForOrganicPlatinumVipOffers,
    addAccountInfoForFirstRadio,
    confirmPrimaryRadioEligible,
    confirmFirstRadioInfoIsPresented,
    selectFindSecondRadio,
    addSecondRadioInfo,
    confirmSecondRadioIsEligible,
    selectPaymentMethodAndSubmit,
    confirmRadiosInfoIsPresented,
    submitReviewAndSubmitStep,
    selectContinueWithOneRadio,
    confirmSecondRadioIsIneligible,
} from './organicVip.helpers';

const firstRadioId = '990003351812';
const last4OfFirstRadioId = '1812';
const secondRadioId = '990003306821';
const last4OfSecondRadioId = '6821';
const accountNumber = '10000239537';

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
    mockRoutesForOrganicPlatinumVipOffers();
});

Given('an eligible customer looking to upgrade 2 radios', () => {
    mockRoutesForOrganicPlatinumVipWith2EligibleRadiosSuccess();
});
Given('an eligible customer looking to upgrade 1 radio', () => {
    mockRoutesForOrganicPlatinumVipWith1EligibleRadioSuccess();
});
Given('a customer with ineligible second radio', () => {
    mockRoutesForOrganicPlatinumVipWithSecondIneligibleRadio();
});

When('they enter the Platinum VIP flow', () => {
    cy.visit('/subscribe/upgrade-vip/flepz?tbView=DM&programcode=PLTOFFERVIP');
});

//Scenario: (Positive) Customer upgraded to Platinum VIP with 2 radios

And('they verify their first radio', () => {
    addAccountInfoForFirstRadio(firstRadioId, accountNumber);
});

And('the primary radio is found and eligible', () => {
    confirmPrimaryRadioEligible(last4OfFirstRadioId);
});

Then('they should see the info about their first radio', () => {
    confirmFirstRadioInfoIsPresented(last4OfFirstRadioId);
});

And('they add the second radio', () => {
    selectFindSecondRadio();
    addSecondRadioInfo(secondRadioId);
});

And('the second radio is found and eligible', () => {
    confirmSecondRadioIsEligible(last4OfSecondRadioId);
});

Then('they should be able to complete their purchase with 2 radios', () => {
    selectPaymentMethodAndSubmit();
    confirmRadiosInfoIsPresented(last4OfFirstRadioId, last4OfSecondRadioId);
    submitReviewAndSubmitStep();
    cy.wait(9000);
    sxmCheckPageLocation('/subscribe/upgrade-vip/thanks');
});

//Scenario: (Positive) Customer looking to upgrade to Platinum VIP without second radio

And('they verify their first radio', () => {
    addAccountInfoForFirstRadio(firstRadioId, accountNumber);
});

And('the primary radio is found and eligible', () => {
    confirmPrimaryRadioEligible(last4OfFirstRadioId);
    confirmFirstRadioInfoIsPresented(last4OfFirstRadioId);
});

Then('they can proceed with only one radio', () => {
    selectContinueWithOneRadio();
});

And('they should be able to complete their purchase with 1 radio', () => {
    selectPaymentMethodAndSubmit();
    confirmRadiosInfoIsPresented(last4OfFirstRadioId);
    submitReviewAndSubmitStep();
    sxmCheckPageLocation('/subscribe/upgrade-vip/thanks');
});

//Scenario: (Negative) Customer looking to upgrade to Platinum VIP with ineligible second radio
And('they verify their first radio', () => {
    addAccountInfoForFirstRadio(firstRadioId, accountNumber);
});

And('the primary radio is found and eligible', () => {
    confirmPrimaryRadioEligible(last4OfFirstRadioId);
    confirmFirstRadioInfoIsPresented(last4OfFirstRadioId);
});

And('they add the second radio that is ineligible', () => {
    selectFindSecondRadio();
    addSecondRadioInfo('X65100AV');
});

Then('they should see the ineligibility error', () => {
    confirmSecondRadioIsIneligible();
});
