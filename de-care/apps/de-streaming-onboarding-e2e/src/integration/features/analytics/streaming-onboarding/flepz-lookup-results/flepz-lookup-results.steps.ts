import { Before, Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { appEventDataHasComponentRecord, appEventDataHasRecord } from '@de-care/shared/e2e';
import { fillOutFlepzWithGeneralData, servicesUrlPrefix } from '../../../../../support/helpers';

Before(() => {
    cy.server();
    cy.route('GET', `${servicesUrlPrefix}/utility/env-info`, require('../../../../../fixtures/features/analytics/streaming-onboarding/env-info.json'));
    cy.route('POST', `${servicesUrlPrefix}/offers/all-package-desc`, require('../../../../../fixtures/features/analytics/streaming-onboarding/all-package-descriptions.json'));
    cy.visit('/setup-credentials/find-account');
    appEventDataHasRecord({
        event: 'flow-started',
        flowInfo: { flowName: 'onboarding' }
    });
    appEventDataHasComponentRecord('flepz');
});

Given(/^A customer submits the FLEPZ form with no match data$/, () => {
    cy.route(
        'POST',
        `${servicesUrlPrefix}/identity/streaming/flepz`,
        require('../../../../../fixtures/features/analytics/streaming-onboarding/streaming-flepz-no-match.json')
    );
    fillOutFlepzWithGeneralData();
    cy.get('[data-e2e="FlepzFormSubmitButton"]').click();
});
Then(/^the EDDL should contain entries for no match$/, () => {
    appEventDataHasRecord({
        event: 'streaming-account-lookup',
        accountInfo: { subscriptions: [] }
    });
    appEventDataHasComponentRecord('enterrid');
});

Given(/^A customer submits the FLEPZ form with single match data$/, function() {
    cy.route(
        'POST',
        `${servicesUrlPrefix}/identity/streaming/flepz`,
        require('../../../../../fixtures/features/analytics/streaming-onboarding/streaming-flepz-single-match.json')
    );
    fillOutFlepzWithGeneralData();
    cy.get('[data-e2e="FlepzFormSubmitButton"]').click();
});
Then(/^the EDDL should contain entries for single match$/, function() {
    appEventDataHasRecord({
        event: 'streaming-account-lookup',
        accountInfo: {
            subscriptions: [
                {
                    eligibleService: null,
                    eligibilityType: 'CREATE_LOGIN',
                    inEligibleReasonCode: 'ExistingSxir',
                    last4DigitsOfRadioId: 'YDR4',
                    type: 'SELF_PAID'
                }
            ]
        }
    });
    appEventDataHasComponentRecord('setupcredentials');
});

Given(/^A customer submits the FLEPZ form with multiple match data$/, function() {
    cy.route(
        'POST',
        `${servicesUrlPrefix}/identity/streaming/flepz`,
        require('../../../../../fixtures/features/analytics/streaming-onboarding/streaming-flepz-multiple-match.json')
    );
    fillOutFlepzWithGeneralData();
    cy.get('[data-e2e="FlepzFormSubmitButton"]').click();
});
Then(/^the EDDL should contain entries for two matches$/, function() {
    appEventDataHasRecord({
        event: 'streaming-account-lookup',
        customerInfo: { customerType: 'SELF_PAY', authType: 'FLEPZ' },
        accountInfo: {
            subscriptions: [
                {
                    eligibleService: null,
                    eligibilityType: 'CREATE_LOGIN',
                    inEligibleReasonCode: 'ExistingSxir',
                    last4DigitsOfRadioId: '2B89',
                    type: 'PROMO'
                },
                {
                    eligibleService: null,
                    eligibilityType: 'CREATE_LOGIN',
                    inEligibleReasonCode: 'ExistingSxir',
                    last4DigitsOfRadioId: 'YD48',
                    type: 'TRIAL'
                }
            ]
        }
    });
    appEventDataHasComponentRecord('multipleaccountsfound');
});
