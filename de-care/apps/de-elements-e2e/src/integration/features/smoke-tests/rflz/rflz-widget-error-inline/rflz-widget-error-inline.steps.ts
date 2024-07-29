import { mockRouteForAllPackageDescriptions, mockRouteForCardBinRanges, mockRouteForEnvInfo, servicesUrlPrefix } from '@de-care/shared/e2e';
import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Before(() => {
    cy.server();
    mockRouteForEnvInfo();
    mockRouteForAllPackageDescriptions();
    mockRouteForCardBinRanges();
});

Given('a customer is presented the RFLZ widget', () => {
    cy.visit('/');
    cy.get('[data-e2e="elements.tab.rflz"]').click();
});

When('the customer enters there information', () => {
    cy.get('[data-e2e="rflzForm.radioId"]')
        .first()
        .type('990003224766', { force: true });
    cy.get('[data-e2e="rflzForm.firstName"]')
        .first()
        .type('Baker', { force: true });
    cy.get('[data-e2e="rflzForm.lastName"]')
        .first()
        .type('Mayfield', { force: true });
    cy.get('[data-e2e="rflzForm.zipCode"]')
        .first()
        .type('12345', { force: true });
});

And(`clicks the check my eligiblity button {int}`, code => {
    cy.route('POST', `${servicesUrlPrefix}/trial/used-car-eligibility-check`, require(`../../../../../fixtures/features/smoke-tests/rflz/used-car-eligibility-${code}.json`));

    cy.get('[data-e2e="rflzForm.submitButton"]')
        .first()
        .click();
});

Then(`the system displays the error message in the alert pill inline of the rflz widget`, () => {
    cy.get('sxm-ui-alert-pill').should('exist');
    cy.get('sxm-ui-alert-pill > p').within(text => {
        const copyString = text['0'].innerText as string;
        expect(copyString.indexOf('checkout') === -1).true;
    });
});
