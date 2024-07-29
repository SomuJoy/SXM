import { HarMock, cyGetSpinner, sxmCheckPageLocation } from '@de-care/shared/e2e';
/**
 * What is this file?
 * This file is loaded before any tests are run and provides an ability to specify custom commands e.g. `cy.whatever()`
 *
 * See https://docs.cypress.io/api/cypress-api/custom-commands.html for full documentation
 *
 * How can we add a new command?
 * First create the command
 * ```
 * Cypress.Commands.add('nameOfCommand', () => {});
 * ```
 *
 * Then in the file commands.type.ts
 * extend the namespace definition to include the new function signature
 * (specify arguments with types and check the return type)
 * ```
 * interface Chainable<Subject> {
 *   nameOfCommand(): void;
 * }
 * ```
 */

Cypress.Commands.add('sxmEnsureNoMissingTranslations', () => {
    cy.contains(/({{\w+?}})/).should('not.exist'); // no translated text with unfulfilled interpolated values
});

Cypress.Commands.add('sxmWaitForSpinner', () => {
    cyGetSpinner()
        .should('be.visible')
        .then(() => {
            cyGetSpinner().should('not.exist');
        });
});

Cypress.Commands.add('sxmCheckPageLocation', (expectedPath: string) => sxmCheckPageLocation(expectedPath));

Cypress.Commands.add('sxmReplaceMockFromHAR', (mocks: { [key: string]: Partial<HarMock>[] }, alias: string, index: number) => {
    cy.route(
        `${mocks[alias][index].request.method}`,
        `${Cypress.env('microservicesEndpoint')}${mocks[alias][index].request.url}`,
        mocks[alias][index].response.content.text
    ).as(alias);
});

Cypress.Commands.add('sxmIsCanadaMode', () => {
    return Cypress.env('isCanada');
});
