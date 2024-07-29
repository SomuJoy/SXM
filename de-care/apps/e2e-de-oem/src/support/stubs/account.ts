export const stubAccountOemSuccess = () => {
    cy.intercept('POST', '**/services/account/oem', { fixture: 'account/acount-oem_account-exists.json' });
};
