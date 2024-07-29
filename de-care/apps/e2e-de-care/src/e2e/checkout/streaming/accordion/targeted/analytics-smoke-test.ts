import { Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountTokenWithCardOnFile } from '../../../../../support/stubs/de-microservices/account';
import { visitCheckoutTargetedAccordionWithToken } from '../common-utils/ui';
import { stubOffersCustomerSuccessDigitalPromo } from '../../../../../support/stubs/de-microservices/offers';

Before(() => {
    stubAccountTokenWithCardOnFile();
    stubOffersCustomerSuccessDigitalPromo();
});

// Scenario: Legacy digital data object exists on Window object
When(/^a customer visits the experience$/, () => {
    visitCheckoutTargetedAccordionWithToken();
});
