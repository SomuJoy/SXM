import { Before, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountSuccessWithInactive, stubNewHotAndTrendingSuccess } from '../common-utils/stubs';
import { stubAccountNextBestActionSuccessWithNoActions, stubAccountNextBestActionSuccessWithActions } from '../../../../../support/stubs/de-microservices/account';
import { stubAllPackageDescriptionsSuccess } from '../../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import { stubUtilityCardBinRangesSuccess, stubUtilityEnvInfoSuccess } from '../../../../../support/stubs/de-microservices/utility';
import { stubAccountSuccess, stubFlepzRadioWithResults } from './../common-utils/stubs';
import { stubQuotesReactivationQuote } from '../../../../../support/stubs/de-microservices/quotes';
import { stubAccountNonPii, stubDeviceInfoWithVehicle, stubOffersCustomerAddForAddRadio, stubOffersInfoSelfPayPromoSuccess } from './../common-utils/stubs';

Before(() => {
    stubUtilityEnvInfoSuccess();
    stubUtilityCardBinRangesSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
    stubAllPackageDescriptionsSuccess();
});

export function getRadioInfoAndOffers() {
    stubAccountNonPii();
    stubDeviceInfoWithVehicle();
    stubOffersCustomerAddForAddRadio();
    stubOffersInfoSelfPayPromoSuccess();
}

export function gotoManageRoute() {
    stubAccountNextBestActionSuccessWithNoActions();
    stubNewHotAndTrendingSuccess();
    cy.visit('/account/manage');
}

Given(/^a customer visits the my account experience while logged in$/, () => {
    stubAccountSuccess();
    gotoManageRoute();
});

Given(/^a customer visits the my account experience while logged in with an inactive radio$/, () => {
    stubAccountSuccessWithInactive();
    stubQuotesReactivationQuote();
    gotoManageRoute();
});

Then(/^they should be routed to the dashboard experience$/, () => {
    cy.url().should('contain', '/dashboard');
});

// Scenario: Dashboard routes to subscription page
When(/^they take action to view all subscriptions$/, () => {
    cy.get('[data-test="linkToViewAllSubscriptions"]').click({ force: true });
});

Then(/^they should be routed to the subscriptions page$/, () => {
    cy.url().should('contain', '/subscriptions');
});

When(/^they choose to reactivate an inactive radio$/, () => {
    getRadioInfoAndOffers();
    cy.get('[data-test="inactivateSubscriptionsButton"]').click({ force: true });
});

When(/^they choose to add a car and streaming subscription$/, () => {
    stubFlepzRadioWithResults();
    cy.get('[data-test="carAndStreamingLinkButton"]').click({ force: true });
});

Then(/^they should be presented with the select your radio page$/, () => {
    cy.get('[data-test="SelectYourRadioFormOption"]').should('be.visible');
});

When(/^they choose to look up a radio that is not listed$/, () => {
    stubFlepzRadioWithResults();
    cy.get('[data-test="DeviceLookupRadioFormOption"] input').click({ force: true });
    cy.get('[data-test="SelectYourRadioFormSubmit"]').click({ force: true });
});

When(/^they choose to add find subscriptions to add$/, () => {
    stubFlepzRadioWithResults();
    cy.get('[data-test="findSubscriptionButton"]').click({ force: true });
});

Then(/^they should be presented with the lookup a radio page$/, () => {
    cy.get('[data-test="deviceLookupIdOptionsForm"]').should('be.visible');
});
