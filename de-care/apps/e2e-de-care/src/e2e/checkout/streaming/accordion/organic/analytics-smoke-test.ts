import { Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { visitCheckoutOrganicAccordion } from '../common-utils/ui';
import { stubOffersSuccessDigitalPromo } from '../../../../../support/stubs/de-microservices/offers';

Before(() => {
    stubOffersSuccessDigitalPromo();
});

// Scenario: Legacy digital data object exists on Window object
When(/^a customer visits the experience$/, () => {
    visitCheckoutOrganicAccordion();
});
