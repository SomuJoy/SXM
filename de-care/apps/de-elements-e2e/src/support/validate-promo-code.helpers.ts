import { defaultAliasingFn, mockRoutesFromHAR } from '@de-care/shared/e2e';
import { settingsOverrideDataKey, settingsOverrideFlagKey } from './settings-override';
import { cyGetPromoCodeValidationContinueButton, cyGetPromoCodeValidationInput, cyGetPromoCodeValidationError } from './validate-promo-code.po';

const optsForMocksFromHAR = { aliasingFn: defaultAliasingFn, prefix: '**' };

export function mockDefaultCallsForValidPromoCode() {
    mockRoutesFromHAR(require('../fixtures/validate-promo-code/validate-promo-code-valid.har.json'), optsForMocksFromHAR);
}

export function mockDefaultCallsForRedeemedPromoCode() {
    mockRoutesFromHAR(require('../fixtures/validate-promo-code/validate-promo-code-redeemed.har.json'), optsForMocksFromHAR);
}

export function mockDefaultCallsForInvalidPromoCode() {
    mockRoutesFromHAR(require('../fixtures/validate-promo-code/validate-promo-code-invalid.har.json'), optsForMocksFromHAR);
}

export function typePromoCode(promocode: string) {
    cyGetPromoCodeValidationInput().type(promocode);
}

export function verifyValidPromoCodeAction() {
    cyGetPromoCodeValidationContinueButton().click();
    cy.wait(2000);
    cyGetPromoCodeValidationError().should('not.exist');
}

export function verifyError() {
    cyGetPromoCodeValidationContinueButton().click();
    cy.wait(2000);
    cyGetPromoCodeValidationError().should('exist');
}

export const setLocalStorageOverrideForValidationRedirectUrl = () =>
    cy.window().then(win => {
        win.localStorage.setItem(settingsOverrideFlagKey, '1');
        -win.localStorage.setItem(settingsOverrideDataKey, '{"promocodeValidationBaseRedirectUrl": ""}');
    });

export const clearLocalStorageOverrideForRflzRedirectUrl = () =>
    cy.window().then(win => {
        win.localStorage.removeItem(settingsOverrideFlagKey);
        win.localStorage.removeItem(settingsOverrideDataKey);
    });
