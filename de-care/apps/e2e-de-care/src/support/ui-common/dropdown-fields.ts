Cypress.Commands.add('selectValueInDropdown', (selector: string, value: string) => {
    cy.get(selector).contains(value).click({ force: true });
});
