import { clearAppEventData, mockRouteForAllPackageDescriptions } from '@de-care/shared/e2e';
import { After, And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import {
    clearLocalStorageOverrideForRflzRedirectUrl,
    eventArrayHasFormFieldErrorRecordsFromEmptyFormFields,
    eventArrayHasRecordForAuthenticationType,
    eventArrayHasRecordForPromoCode,
    eventArrayHasRecordForRadioId,
    eventArrayHasRflzLookupFailedRecords,
    eventArrayHasRflzPageRecord,
    fillOutRflzFormWithValidData,
    mockRflzLookupFailure,
    mockRflzLookupFailureForPromoCode,
    mockRflzLookupSuccess,
    setLocalStorageOverrideForRflzRedirectUrl,
    submitRflzForm,
    submitRflzFormWithValidData
} from '../../../support/rflz.po';

Before(() =>
    setLocalStorageOverrideForRflzRedirectUrl().then(() => {
        cy.server();
        mockRouteForAllPackageDescriptions();
    })
);
After(() => clearLocalStorageOverrideForRflzRedirectUrl());

Given('a user is on a page with the RFLZ widget', () => {
    cy.visit('/');
    cy.get('[data-e2e="elements.tab.rflz"]').click();
    // Since there are multiple widgets on this page we need to remove the rflz one and re-add it so that
    //  its "page impression" events come at the right time before we test for them.
    //  (without this, another widget could do a page impression after this widget and result in a different
    //   page impression component value)
    // This is a byproduct of how we have the index.html sample page set up for the elements. Improving that
    //  would help eliminate this spec need.
    cy.get('[data-e2e="elements.tab.rflz"] + div.el-tab').then(el => {
        clearAppEventData().then(() => {
            el.empty().append('<sxm-rflz-widget></sxm-rflz-widget>');
        });
    });
});

// Scenario: Component is rendered
Then('the data layer should have an authentication page record for the RFLZ component', () => {
    eventArrayHasRflzPageRecord();
});
And('a track event that RFLZ was loaded', () => {
    // need to figure out how to assert Angulartics track event
});

// Scenario: Client side validation
When('they submit the form without filling out any fields', () => {
    submitRflzForm();
});
Then('the data layer should have error records for all invalid fields', () => {
    eventArrayHasFormFieldErrorRecordsFromEmptyFormFields();
});

// Scenario: Submission failure (general)
When('they submit the form and lookup failed', () => {
    mockRflzLookupFailure();
    submitRflzFormWithValidData();
});
Then('there should be a track event that RFLZ failed', () => {
    eventArrayHasRflzLookupFailedRecords();
});

// Scenario: Submission failure (promo code)
When('they submit the form and lookup failed due to invalid promo code', () => {
    mockRflzLookupFailureForPromoCode();
    submitRflzFormWithValidData();
});
Then('the data layer should have a record for the promo code', () => {
    eventArrayHasRecordForPromoCode('LIFETRIALRESTORE');
});

// Scenario: Successful submission
Given('a user is on a page with the RFLZ widget and ready with valid data for a successful lookup', () => {
    mockRflzLookupSuccess();
    cy.visit('/');
    cy.get('[data-e2e="elements.tab.rflz"]').click();
});
When('they submit the form with valid data for a successful lookup', () => {
    fillOutRflzFormWithValidData();
    submitRflzForm();
});
Then('the data layer should have a record for the radio id', () => {
    eventArrayHasRecordForRadioId('00WW');
});
And('the data layer should have a record for the authentication type', () => {
    eventArrayHasRecordForAuthenticationType();
});
And('a track event that RFLZ was successful', () => {
    // need to figure out how to assert Angulartics track event
});
