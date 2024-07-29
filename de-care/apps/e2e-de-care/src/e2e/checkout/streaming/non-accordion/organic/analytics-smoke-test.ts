import { Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { visitCheckoutOrganicWithAllowedProgramCode } from '../common-utils/ui';
import { stubOffersSuccessDigitalRtpFree } from '../../../../../support/stubs/de-microservices/offers';

Before(() => {
    stubOffersSuccessDigitalRtpFree();
});

// Scenario: Legacy digital data object exists on Window object
When(/^a customer visits the experience$/, () => {
    visitCheckoutOrganicWithAllowedProgramCode();
});
