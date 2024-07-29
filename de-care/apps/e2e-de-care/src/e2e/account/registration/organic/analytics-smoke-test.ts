import { Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { visitRegistrationOrganic } from './common-utils/ui';

Before(() => {});

// Scenario: Legacy digital data object exists on Window object
When(/^a customer visits the experience$/, () => {
    visitRegistrationOrganic();
});
