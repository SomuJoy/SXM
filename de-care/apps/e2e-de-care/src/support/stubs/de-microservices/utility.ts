export const stubUtilityEnvInfoSuccess = () => {
    cy.intercept('GET', '**/services/utility/env-info', { fixture: 'de-microservices/utility/env-info/success.json' });
};
export const stubUtilityEnvInfo500 = () => {
    cy.intercept('GET', '**/services/utility/env-info', { statusCode: 500 });
};

export const stubUtilityCardBinRangesSuccess = () => {
    cy.intercept('POST', '**/services/utility/card-bin-ranges', { fixture: 'de-microservices/utility/card-bin-ranges/success.json' });
};

export const stubUtilitySecurityQuestionsSuccess = () => {
    cy.intercept('GET', '**/services/utility/security-questions', { fixture: 'de-microservices/utility/security-questions/success.json' });
};

export const stubUtilityCheckEligibilityCaptcha = () => {
    cy.intercept('POST', '**/services/check-eligibility/captcha', {});
};

export const stubUtilityLogMessageSuccess = () => {
    cy.intercept('POST', '**/services/utility/log-message', { fixture: 'de-microservices/utility/log-message/success.json' });
};

export const stubUtilityCaptchaValidateSuccess = () => {
    cy.intercept('POST', '**/services/utility/captcha/validate', { fixture: 'de-microservices/utility/captcha/validate/success.json' });
};

export const stubUtilityCaptchaNewSuccess = () => {
    cy.intercept('POST', '**/services/utility/captcha/new', { fixture: 'de-microservices/utility/captcha/new/success.json' });
};

export const stubUtilityIp2locationSuccess = () => {
    cy.intercept('POST', '**/services/utility/ip2location', { fixture: 'de-microservices/utility/ip2location/success.json' });
};
