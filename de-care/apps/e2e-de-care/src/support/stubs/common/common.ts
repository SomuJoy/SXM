Cypress.Commands.add('stubSockJs', () => {
    cy.intercept('GET', '**/sockjs-node/info?t=*', { fixture: 'common/sockjs-node-info.json' });
});
