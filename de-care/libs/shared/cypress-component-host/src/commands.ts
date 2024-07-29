/// <reference types="cypress" />
import { mount } from 'cypress/angular';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import 'cypress-axe';

export interface InjectOptions {
    axeCorePath?: string;
}
declare const injectAxe: (injectOptions?: InjectOptions | undefined) => void;

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        interface Chainable<Subject> {
            mount: typeof mount;
            injectAxe: typeof injectAxe;
        }
    }
}

Cypress.Commands.add('mount', mount);
Cypress.Commands.overwrite('injectAxe', () => {
    // cy.injectAxe is currently broken. https://github.com/component-driven/cypress-axe/issues/82

    // We need to know the node_modules path relative to where Cypress is being run, so we put the responsibility
    //  on the Cypress project config to define an env variable for the nodeModulesPath
    const nodeModulesPath = Cypress.env('nodeModulesPath');

    // Get the axe js file and eval it onto the browser window so the code is available
    cy.readFile(`${nodeModulesPath}/axe-core/axe.min.js`).then((source) => {
        return cy.window({ log: false }).then((window) => {
            window.eval(source);
        });
    });
});
// TODO: consider overwriting checkA11y to support auto wiring up terminalLogForAxeViolations
