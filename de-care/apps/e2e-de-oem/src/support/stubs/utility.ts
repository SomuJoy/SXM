export const stubEnvInfoSuccess = () => {
    cy.intercept('GET', '**/services/utility/env-info', { fixture: 'utility/utility-env-info-success.json' });
};
export const stubLogMessageSuccess = () => {
    cy.intercept('POST', '**/services/utility/log-message', { fixture: 'utility/utility-log-message-success.json' });
};
export const stubCardBinRangesSuccess = () => {
    cy.intercept('POST', '**/services/utility/card-bin-ranges', { fixture: 'utility/utility-card-bin-ranges-success.json' });
};
