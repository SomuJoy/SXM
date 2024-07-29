// @ts-check
///<reference path="../global.d.ts" />

import './stubs/account';
import './stubs/apigateway';
import './stubs/identity';
import './stubs/offers';
import './stubs/utility';

Cypress.Commands.add('stubSockJs', () => {
    cy.intercept('GET', '**/sockjs-node/info?t=*', { fixture: 'sockjs-node-info.json' });
});

beforeEach(() => {
    cy.stubSockJs();
});
