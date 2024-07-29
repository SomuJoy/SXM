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

export const fillOutAccountLookup = () => {
    cy.get('sxm-ui-text-form-field').within(() => {
        cy.get('[data-e2e="sxmUITextFormField"]').type('990005299056', { force: true });
    });
    submit('[data-e2e="LookupByRadioOrAccountContinueButton"]');
};

export const fillOutCNAForm = () => {
    getElementFromIndex(2, '[data-e2e="sxmUITextFormField"]').type('1234 street road', { force: true });
    getElementFromIndex(3, '[data-e2e="sxmUITextFormField"]').type('Gotham City', { force: true });
    cy.get('sxm-ui-dropdown').type('co{enter}', { force: true });
    submit('[data-e2e="CNAFormContinueButton"]');
    submit('[data-e2e="verifyAddress.retainButton"]');
};

export const fillOutSecurityQuestions = () => {
    cy.get('[data-e2e="registrationForm.securityQuestions"]').within(() => {
        fillOutSecurityQuestion(0, 'batty');
        fillOutSecurityQuestion(1, 'baseball field');
        fillOutSecurityQuestion(2, '911');
    });
    submit();
};

export const fillOutPassword = () => {
    cy.get('[data-e2e="sxmUIPassword"]').type('sdfRTY23&%', { force: true });
    // click out of password then continue
    cy.get('h4')
        .click({ force: true })
        .then(() => {
            cy.wait(1000).then(() => {
                submit('[data-e2e="registrationForm.completeRegistrationButton"]');
            });
        });
};

const fillOutSecurityQuestion = (index: number, text: string) => {
    cy.get('sxm-ui-dropdown')
        .eq(index)
        .click({ force: true });
    cy.get('sxm-ui-dropdown')
        .eq(index)
        .within(() => {
            cy.get('[data-e2e="sxmDropDownItem"]')
                .eq(index)
                .click({ force: true });
        });
    cy.get('[data-e2e="sxmUITextFormField"]')
        .eq(index)
        .type(text, { force: true });
};

export const verifyWithAccountNumber = () => {
    cy.get('[data-e2e="sxmUITextFormField"]').type('10000243458', { force: true });
    submit('[data-e2e="verifyOptionsForm.continueButton"]');
};

export const submit = (tag?: string) => {
    tag ? cy.get(tag).click({ force: true }) : cy.get('button').click({ force: true });
};

export const getElementFromIndex = (index: number, element: string) => {
    return cy.get(element).eq(index);
};

export const mockBeatTheSoldAPICalls = () => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
    cy.sxmMockPasswordValidationSuccess();
    cy.route('GET', `${servicesUrlPrefix}/utility/security-questions`, require('../../../../fixtures/features/business-logic/registration/security-questions.json'));
    cy.route('POST', `${servicesUrlPrefix}/identity/registration/flepz`, require('../../../../fixtures/features/business-logic/registration/beat-the-sold-flepz.json'));
    cy.route('POST', `${servicesUrlPrefix}/account/registration/non-pii`, require('../../../../fixtures/features/business-logic/registration/beat-the-sold-non-pii.json'));
    cy.route('POST', `${servicesUrlPrefix}/authenticate/verify-pii-data`, require('../../../../fixtures/features/business-logic/registration/beat-the-sold-verify-pii.json'));
    cy.route(
        'POST',
        `${servicesUrlPrefix}/validate/customer-info`,
        require('../../../../fixtures/features/business-logic/registration/beat-the-sold-address-validation.json')
    );
    cy.route(
        'POST',
        `${servicesUrlPrefix}/account/registration/account-profile`,
        require('../../../../fixtures/features/business-logic/registration/beat-the-sold-account-profile.json')
    );
    cy.route('POST', `${servicesUrlPrefix}/account/register`, require('../../../../fixtures/features/business-logic/registration/register.json'));
};

export const mockStepUpAPICalls = () => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
    cy.route('GET', `${servicesUrlPrefix}/utility/security-questions`, require('../../../../fixtures/features/business-logic/registration/security-questions.json'));
    cy.route('POST', `${servicesUrlPrefix}/account/auth-verify-options`, require('../../../../fixtures/features/business-logic/registration/step-up-verify-options.json'));
    cy.route('POST', `${servicesUrlPrefix}/account/registration/non-pii`, require('../../../../fixtures/features/business-logic/registration/step-up-non-pii.json'));
    cy.route('POST', `${servicesUrlPrefix}/authenticate/verify-pii-data`, require('../../../../fixtures/features/business-logic/registration/step-up-verify-pii-data.json'));
};
