import { appEventDataHasClickRecord } from '@de-care/shared/e2e';
import { Before, Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { servicesUrlPrefix, mockResponses, submitFlepz } from '../../../../../support/helpers';

Before(() => {
    cy.server();
    cy.route('GET', `${servicesUrlPrefix}/utility/env-info`, require('../../../../../fixtures/features/analytics/streaming-onboarding/env-info.json'));
    cy.route('POST', `${servicesUrlPrefix}/offers/all-package-desc`, require('../../../../../fixtures/features/analytics/streaming-onboarding/all-package-descriptions.json'));
    cy.visit('/setup-credentials/find-account');
});

Given(/^A customer clicks the submit button$/, () => {
    submitFlepz(mockResponses.existingsxirnocredentials);
});
Then(/^the EDDL should contain a submit entry for user click$/, () => {
    appEventDataHasClickRecord('submit', false);
});
