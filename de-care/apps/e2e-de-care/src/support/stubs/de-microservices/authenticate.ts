export const stubAuthenticateVerifyPiiDataSuccess = () => {
    cy.intercept('POST', '**/services/authenticate/verify-pii-data', { fixture: 'de-microservices/authenticate/verify-pii-data/success.json' });
};

export const stubAuthenticateLoginSuccess = () => {
    cy.intercept('POST', '**/services/authenticate/login', { fixture: 'de-microservices/authenticate/login/success.json' });
};

export const stubAuthenticateLoginThirdPartyPartner = () => {
    cy.intercept('POST', '**/services/authenticate/login', { fixture: 'de-microservices/authenticate/login/third-party-partner.json' });
};

export const stubAuthenticateLinkingAmazonSuccess = () => {
    cy.intercept('POST', '**/services/authenticate/linking/amazon', { fixture: 'de-microservices/authenticate/linking/amazon/success.json' });
};

export const stubAuthenticateLinkingAmazonFail = () => {
    cy.intercept('POST', '**/services/authenticate/linking/amazon', { fixture: 'de-microservices/authenticate/linking/amazon/fail.json' });
};

export const stubAuthenticateVerifySecurityCodeSuccess = () => {
    cy.intercept('POST', '**/services/authenticate/verify-security-code', { fixture: 'de-microservices/authenticate/verify-security-code/success.json' });
};

export const stubAuthenticateLinkingGoogleSuccess = () => {
    cy.intercept('POST', '**/services/authenticate/linking/google', { fixture: 'de-microservices/authenticate/linking/google/success.json' });
};

export const stubAuthenticateLogoutSuccess = () => {
    cy.intercept('POST', '**/services/authenticate/logout', { fixture: 'de-microservices/authenticate/logout/success.json' });
};

export const stubAuthenticateVerifyPhoneSuccess = () => {
    cy.intercept('POST', '**/services/authenticate/verify-phone', { fixture: 'de-microservices/authenticate/verify-phone/success.json' });
};
