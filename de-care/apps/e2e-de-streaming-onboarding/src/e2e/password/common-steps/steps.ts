import { Before, Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubAllPackageDescriptionsSuccess } from '../../../support/stubs/offers';
import { stubEnvInfoSuccess } from '../../../support/stubs/utility';

Before(() => {
    stubEnvInfoSuccess();
    stubAllPackageDescriptionsSuccess();
});

Given(/^a customer visits the forgot password experience$/, () => {
    cy.visit('/setup-credentials/forgot-password');
});
Then(/^they should land on the account not found page$/, () => {
    cy.url().should('contain', '/setup-credentials/account-not-found');
});
