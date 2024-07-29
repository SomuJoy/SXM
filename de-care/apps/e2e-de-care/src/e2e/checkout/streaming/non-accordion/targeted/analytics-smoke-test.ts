import { Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountLoadAndOffersForRtd } from './common-utils/stubs';
import { visitCheckoutTargetedRtdWithAllowedProgramCode } from './common-utils/ui';

Before(() => {
    stubAccountLoadAndOffersForRtd();
});

// Scenario: Legacy digital data object exists on Window object
When(/^a customer visits the experience$/, () => {
    visitCheckoutTargetedRtdWithAllowedProgramCode();
});
