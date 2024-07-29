export const stubCredentialsRecoveryAccountNotFound = () => {
    cy.intercept('POST', '**/services/identity/customer/credentials-recovery', {
        fixture: 'identity/identity-customer-credentials-recovery-account-not-found.json',
        statusCode: 400,
    });
};
