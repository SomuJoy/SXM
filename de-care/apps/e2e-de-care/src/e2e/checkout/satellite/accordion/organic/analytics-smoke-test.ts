import { Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubOffersSuccessSatellitePromoSelfPay } from '../../../../../support/stubs/de-microservices/offers';

Before(() => {
    stubOffersSuccessSatellitePromoSelfPay();
});

// Scenario: Legacy digital data object exists on Window object
When(/^a customer visits the experience$/, () => {
    cy.visit(`/subscribe/checkout/flepz?programcode=6FOR30SELECT`);
});
