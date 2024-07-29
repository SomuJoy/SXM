export const stubCredentialRecoveryPasswordSendEmailSuccess = () => {
    cy.intercept('POST', '**/services/account/credential-recovery/password/send-email', { fixture: 'account/account-credential-recovery-password-send-email-success.json' });
};
export const stubCredentialRecoveryPasswordSendEmail400Error = () => {
    cy.intercept('POST', '**/services/account/credential-recovery/password/send-email', {
        fixture: 'account/account-credential-recovery-password-send-email-400-error.json',
        statusCode: 400,
    });
};
