import { servicesUrlPrefix } from '@de-care/shared/e2e';

export const fillOutFlepz = () => {
    cy.get('sxm-ui-flepz-form-fields').within(() => {
        cy.get('[data-e2e="FlepzFirstNameTextfield"]').type('bat', { force: true });
        cy.get('[data-e2e="FlepzLastNameTextfield"]').type('man', { force: true });
        cy.get('[data-e2e="FlepzEmailTextfield"]').type('notbatman@siriusxm.com', { force: true });
        cy.get('[data-e2e="FlepzPhoneNumberTextfield"]').type('2122222222', { force: true });
        cy.get('[data-e2e="FlepzZipCodeTextfield"]').type('12345', { force: true });
    });
    submit();
};

export const assertAlreadyRegisteredUI = () => {
    cy.get('h1').should('have.text', 'This account is already registered.');
    cy.url().should('contain', 'account/registration/registered');
};

export const submit = (tag?: string) => {
    tag ? cy.get(tag).click({ force: true }) : cy.get('button').click({ force: true });
};

export const mockAccountAlreadyRegisteredAPICalls = () => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
    cy.route('POST', `${servicesUrlPrefix}/identity/registration/flepz`, require('../../../../fixtures/features/ui-tests/registration/account-already-registered-flepz.json'));
    cy.route(
        'POST',
        `${servicesUrlPrefix}/account/registration/non-pii`,
        require('../../../../fixtures/features/ui-tests/registration/account-already-registered-non-pii.json')
    );
};
