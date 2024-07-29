import { Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { appEventDataHasComponentRecord } from '@de-care/shared/e2e';
import { fillOutFlepzWithGeneralData, mockResponses, submitFlepz, servicesUrlPrefix } from '../../../../../support/helpers';

Before(() => {
    cy.server();
    cy.route('GET', `${servicesUrlPrefix}/utility/env-info`, require('../../../../../fixtures/features/analytics/streaming-onboarding/env-info.json'));
    cy.route('POST', `${servicesUrlPrefix}/offers/all-package-desc`, require('../../../../../fixtures/features/analytics/streaming-onboarding/all-package-descriptions.json'));
    cy.visit('/setup-credentials/find-account');
});

Given(/^A customer submits the FLEPZ form$/, () => {
    fillOutFlepzWithGeneralData();
});

When(/^the subscription found ineligible status is existingsxirnocredentials$/, () => {
    submitFlepz(mockResponses.existingsxirnocredentials);
});
Then(/^the EDDL should contain entries for existingsxirnocredentials$/, () => {
    appEventDataHasComponentRecord('setupcredentials');
});

When(/^the subscription found ineligible status is existingsxir$/, () => {
    submitFlepz(mockResponses.existingsxir);
});
Then(/^the EDDL should contain entries for existingsxir$/, () => {
    appEventDataHasComponentRecord('singleaccountmatchexistingcredentials');
});

When(/^the subscription found ineligible status is existingsxir and oac credentials is false$/, () => {
    submitFlepz(mockResponses.existingsxiroacfalse);
});
Then(/^the EDDL should contain entries for existingsxir with no oac credentials$/, () => {
    appEventDataHasComponentRecord('setupcredentials');
});

When(/^the subscription found eligible status is sxir_standalone$/, () => {
    submitFlepz(mockResponses.sxir_standalone);
});
Then(/^the EDDL should contain entries for sxir_standalone$/, () => {
    appEventDataHasComponentRecord('noaudio');
});

When(/^the subscription found ineligible status is paymentissues$/, () => {
    submitFlepz(mockResponses.paymentissues);
});
Then(/^the EDDL should contain entries for paymentissues$/, () => {
    appEventDataHasComponentRecord('subscriptionpastdue');
});

When(/^the subscription found ineligible status is expiredaatrial$/, () => {
    submitFlepz(mockResponses.expiredaatrial);
});
Then(/^the EDDL should contain entries for expiredaatrial$/, () => {
    appEventDataHasComponentRecord('trialexpired');
});

When(/^the subscription found ineligible status is insufficientpackage$/, () => {
    submitFlepz(mockResponses.insufficientpackage);
});
Then(/^the EDDL should contain entries for insufficientpackage$/, () => {
    appEventDataHasComponentRecord('noteligiblefortrial');
});

When(/^the subscription found ineligible status is nonconsumer$/, () => {
    submitFlepz(mockResponses.nonconsumer);
});
Then(/^the EDDL should contain entries for nonconsumer$/, () => {
    appEventDataHasComponentRecord('noteligiblefortrial');
});

When(/^the subscription found ineligible status is trialwithinlasttrialdate$/, () => {
    submitFlepz(mockResponses.trialwithinlasttrialdate);
});
Then(/^the EDDL should contain entries for trialwithinlasttrialdate$/, () => {
    appEventDataHasComponentRecord('noteligiblefortrial');
});

When(/^the subscription found ineligible status is maxlifetimetrials$/, () => {
    submitFlepz(mockResponses.maxlifetimetrials);
});
Then(/^the EDDL should contain entries for maxlifetimetrials$/, () => {
    appEventDataHasComponentRecord('noteligiblefortrial');
});
