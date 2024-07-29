export const stubModifySubscriptionOptionsWithCancelEnabled = () => {
    cy.intercept('POST', '**/services/account-mgmt/modify-subscription-options', {
        fixture: 'de-microservices/account-mgmt/modify-subscription-options/with-cancel-enabled.json',
    });
};

export const stubAccountMgmtPreferencesDoNotCallSuccess = () => {
    cy.intercept('POST', '**/account-mgmt/preferences/donotcall', { fixture: 'de-microservices/account-mgmt/preferences/donotcall/success.json' });
};

export const stubAccountMgmtRemoveDeviceSuccess = () => {
    cy.intercept('POST', '**/account-mgmt/remove-device', { fixture: 'de-microservices/account-mgmt/remove-device/success.json' });
};

export const stubAccountMgmtSweepstakesSuccess = () => {
    cy.intercept('POST', '**/account-mgmt/sweepstakes', { fixture: 'de-microservices/account-mgmt/sweepstakes/success.json' });
};

export const stubAccountMgmtUpdateAccountLoginSuccess = () => {
    cy.intercept('POST', '**/account-mgmt/update-account-login', { fixture: 'de-microservices/account-mgmt/update-account-login/success.json' });
};

export const stubAccountMgmtUpdateBillingInfoSuccess = () => {
    cy.intercept('POST', '**/account-mgmt/update-billing-info', { fixture: 'de-microservices/account-mgmt/update-billing-info/success.json' });
};

export const stubAccountMgmtUpdateCustomerInfoSuccess = () => {
    cy.intercept('POST', '**/account-mgmt/update-customer-info', { fixture: 'de-microservices/account-mgmt/update-customer-info/success.json' });
};

export const stubAccountMgmtUpdateNicknameSuccess = () => {
    cy.intercept('POST', '**/account-mgmt/update-nickname', { fixture: 'de-microservices/account-mgmt/update-nickname/success.json' });
};

export const stubAccountMgmtContactPreferences = () => {
    cy.intercept('POST', '**/account-mgmt/contact-preferences', { fixture: 'de-microservices/account-mgmt/contact-preferences/success.json' });
};
