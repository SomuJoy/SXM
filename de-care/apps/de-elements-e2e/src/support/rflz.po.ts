import {
    mockRoutesFromHAR,
    appEventDataHasRecord,
    getDigitalDataCustomerInfo,
    getDigitalDataDeviceInfo,
    getDigitalDataFrontEndErrors,
    getDigitalDataPageInfo,
    defaultAliasingFn
} from '@de-care/shared/e2e';
import { settingsOverrideDataKey, settingsOverrideFlagKey } from './settings-override';

const cyGetRflzFormRadioId = () => cy.get('[data-e2e="rflzForm.radioId"]');
const cyGetRflzFormFirstName = () => cy.get('[data-e2e="rflzForm.firstName"]');
const cyGetRflzFormLastName = () => cy.get('[data-e2e="rflzForm.lastName"]');
const cyGetRflzFormZipCode = () => cy.get('[data-e2e="rflzForm.zipCode"]');
const cyGetRflzFormSubmitButton = () => cy.get('[data-e2e="rflzForm.submitButton"]');

const optsForMocksFromHAR = { aliasingFn: defaultAliasingFn, prefix: '**' };

export const mockRflzLookupSuccess = () => mockRoutesFromHAR(require('../fixtures/rflz/lookup-success.har.json'), optsForMocksFromHAR);
export const mockRflzLookupFailure = () => mockRoutesFromHAR(require('../fixtures/rflz/lookup-failure-general.har.json'), optsForMocksFromHAR);
export const mockRflzLookupFailureForPromoCode = () => mockRoutesFromHAR(require('../fixtures/rflz/lookup-failure-promo-code.har.json'), optsForMocksFromHAR);

export const setLocalStorageOverrideForRflzRedirectUrl = () =>
    cy.window().then(win => {
        win.localStorage.setItem(settingsOverrideFlagKey, '1');
        // set rflzSuccessUrl to empty string so code will not do redirect
        win.localStorage.setItem(settingsOverrideDataKey, '{"rflzSuccessUrl": ""}');
    });
export const clearLocalStorageOverrideForRflzRedirectUrl = () =>
    cy.window().then(win => {
        win.localStorage.removeItem(settingsOverrideFlagKey);
        win.localStorage.removeItem(settingsOverrideDataKey);
    });

export const dataLayerHasRflzPageRecord = () => {
    getDigitalDataPageInfo()
        .its('flowName')
        .should('equal', 'AUTHENTICATE');
    getDigitalDataPageInfo()
        .its('componentName')
        .should('equal', 'rflzLookup');
};

export const fillOutRflzFormWithValidData = () => {
    cyGetRflzFormRadioId().type('KK010080', { force: true });
    cyGetRflzFormFirstName().type('Paula', { force: true });
    cyGetRflzFormLastName().type('Myo', { force: true });
    cyGetRflzFormZipCode().type('10020', { force: true });
};

export const submitRflzFormWithValidData = () => {
    fillOutRflzFormWithValidData();
    submitRflzForm();
};
export const submitRflzForm = () => cyGetRflzFormSubmitButton().click();

export const dataLayerHasFormFieldErrorRecordsFromEmptyFormFields = () => {
    getDigitalDataFrontEndErrors()
        .its(0)
        .its('errorName')
        .should('equal', 'Auth - Missing or invalid VIN');
    getDigitalDataFrontEndErrors()
        .its(1)
        .its('errorName')
        .should('equal', 'Auth - Missing first name');
    getDigitalDataFrontEndErrors()
        .its(2)
        .its('errorName')
        .should('equal', 'Auth - Missing last name');
    getDigitalDataFrontEndErrors()
        .its(3)
        .its('errorName')
        .should('equal', 'Auth - Missing or invalid zip code');
};

export const submitRflzFormAndConfirmSuccessfulDataLayerRecords = () => {
    cy.on('window:before:unload', () => {
        dataLayerHasRecordForRadioId('00WW');
        dataLayerHasRecordForAuthenticationType();
    });
    submitRflzForm();
};

export const dataLayerHasRecordForRadioId = radioId => {
    getDigitalDataDeviceInfo()
        .its('esn')
        .should('equal', radioId);
};

export const dataLayerHasRecordForAuthenticationType = () => {
    getDigitalDataCustomerInfo()
        .its('authenticationType')
        .should('equal', 'RFLZ');
};

export const dataLayerHasRecordForPromoCode = promoCode =>
    getDigitalDataDeviceInfo()
        .its('promoCode')
        .should('equal', promoCode);

export const eventArrayHasRflzPageRecord = () => {
    appEventDataHasRecord({ event: 'Page Loaded', page: { pageName: 'AUTHENTICATE', componentName: 'rflzLookup' } });
    appEventDataHasRecord({ event: 'rflz-loaded' });
};

export const eventArrayHasFormFieldErrorRecordsFromEmptyFormFields = () => {
    appEventDataHasRecord({
        event: 'app-error',
        errorInfo: [
            { errorType: 'USER', errorName: 'Auth - Missing or invalid VIN' },
            { errorType: 'USER', errorName: 'Auth - Missing first name' },
            { errorType: 'USER', errorName: 'Auth - Missing last name' },
            { errorType: 'USER', errorName: 'Auth - Missing or invalid zip code' }
        ]
    });
    appEventDataHasRecord({ event: 'rflz-form-invalid-input' });
};

export const eventArrayHasRflzLookupFailedRecords = () => {
    appEventDataHasRecord({ event: 'used-car-eligibility-check', deviceInfo: { esn: null } });
    appEventDataHasRecord({ event: 'rflz-failed', componentName: 'rflzLookup' });
};

export const eventArrayHasRecordForRadioId = radioId => {
    appEventDataHasRecord({ event: 'used-car-eligibility-check', deviceInfo: { esn: radioId } });
};

export const eventArrayHasRecordForAuthenticationType = () => {
    appEventDataHasRecord({ event: 'rflz-successful', customerInfo: { authenticationType: 'RFLZ' } });
};

export const eventArrayHasRecordForPromoCode = promoCode => {
    appEventDataHasRecord({ event: 'used-car-eligibility-check', deviceInfo: { promoCode } });
};
