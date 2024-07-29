import { Before, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubCustomerOffersRollToChoiceLoad } from './common-utils/stubs';
import { stubAccountTokenClosedDeviceCardOnFile } from '../../../../../support/stubs/de-microservices/account';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Experience loads offer and change renewal correctly for targeted customer via token
When(/^a customer visits the satellite accordion targeted flow for roll to choice with a valid token$/, () => {
    stubCustomerOffersRollToChoiceLoad();
    stubAccountTokenClosedDeviceCardOnFile();
    cy.visit(`/subscribe/checkout/purchase/satellite/targeted?tkn=2f155a50-251c-49b4-9580-5ad98237e849&programcode=3FOR2AATXRTC&renewalCode=BASIC`);
});
Then(/^they should be presented with the roll to choice offer$/, () => {
    cy.wait(['@offersInfoCall']);
    cy.primaryPackageCardIsVisibleAndContains('Sirius Platinum');
});
Then(/^they should see the option to change renewal$/, () => {
    cy.get('[data-test="reviewSubscriptionOptionsLink"').should('be.visible');
});
