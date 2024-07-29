export const stubCookieLaw = () => {
    cy.intercept('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js', { body: '' });
};
Cypress.Commands.add('stubSockJs', () => {
    cy.intercept('GET', '**/sockjs-node/info?t=*', { fixture: 'common/sockjs-node-info.json' });
});
