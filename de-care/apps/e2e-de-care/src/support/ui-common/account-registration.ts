const fillOutSecurityQuestion = (index: number, text: string) => {
    cy.get('sxm-ui-dropdown').eq(index).click({ force: true });
    cy.get('sxm-ui-dropdown')
        .eq(index)
        .within(() => {
            cy.get('[data-test="sxmDropDownItem"]').eq(index).click({ force: true });
        });
    cy.get(`[data-test="securityQuestionAnswer${index + 1}"] input`)
        .clear({ force: true })
        .type(text, { force: true });
};

Cypress.Commands.add('fillOutSecurityQuestions', () => {
    fillOutSecurityQuestion(0, 'batty');
    fillOutSecurityQuestion(1, 'baseball field');
    fillOutSecurityQuestion(2, '911');
});

Cypress.Commands.add('fillOutAndSubmitAccountRegistrationForm', (options: { includePassword: boolean } = { includePassword: false }) => {
    if (options?.includePassword) {
        cy.get('[data-e2e="sxmUIPassword"]').type('P@ssword!');
    }
    cy.fillOutSecurityQuestions();
    cy.get('[data-e2e="register.button"]').click();
});
