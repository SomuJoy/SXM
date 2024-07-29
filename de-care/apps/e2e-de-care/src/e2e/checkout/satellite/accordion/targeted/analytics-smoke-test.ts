import { Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubCustomerOffersSelfPayPromoLoad } from './common-utils/stubs';
import { stubAccountTokenClosedDeviceCardOnFile } from '../../../../../support/stubs/de-microservices/account';

Before(() => {});

// Scenario: Legacy digital data object exists on Window object
When(/^a customer visits the experience$/, () => {
    stubAccountTokenClosedDeviceCardOnFile();
    stubCustomerOffersSelfPayPromoLoad();
    cy.visit(`/subscribe/checkout?tkn=387f04de-16e1-4be7-9e81-cb378f5986ee&programcode=6FOR30SELECT`);
});
