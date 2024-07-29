import { Before, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubUtilityCardBinRangesSuccess, stubUtilityEnvInfoSuccess } from '../../../../../support/stubs/de-microservices/utility';
import { stubAllPackageDescriptionsSuccess, stubOffersSuccessSatelliteOrganicDefaultOfferSelfPay } from '../../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import { primaryPackageCardIsVisibleAndContains } from '../../../../../support/ui-common/package-cards';

Before(() => {
    cy.viewport('iphone-x');
    stubUtilityEnvInfoSuccess();
    stubUtilityCardBinRangesSuccess();
    stubAllPackageDescriptionsSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
    stubOffersSuccessSatelliteOrganicDefaultOfferSelfPay();
});

// Common steps
Given(/^a customer visits the satellite organic flow with no program code$/, () => {
    cy.visit(`subscribe/checkout/purchase/satellite/organic/new`);
    cy.wait(['@offersInfoCall']);
});
Then(/^they should be presented with device lookup options$/, () => {
    cy.get('[data-test="flepzLookupTab"]').should('exist');
    cy.get('[data-test="deviceLookupTab"]').should('exist');
});

// Scenario: Experience loads offer correctly for default offer
Then(/^they should be presented with a default offer$/, () => {
    primaryPackageCardIsVisibleAndContains('SiriusXM Music & Entertainment');
});

// Scenario: Experience presents device lookup options
When(/^they click continue on the offer presentment page$/, () => {
    cy.get('[data-test="continueButton"]').click();
});

// Scenario: Can start on device lookup options page
Given(/^a customer visits the satellite organic flow device lookup page with no program code$/, () => {
    cy.visit(`subscribe/checkout/purchase/satellite/organic/new/device-lookup`);
    cy.wait(['@offersInfoCall']);
});
