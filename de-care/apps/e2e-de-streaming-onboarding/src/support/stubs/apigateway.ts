export const stubUpdateUseCaseSuccess = () => {
    cy.intercept('POST', '**/services/apigateway/update-usecase', { fixture: 'apigateway/apigateway-update-use-case-success.json' });
};
