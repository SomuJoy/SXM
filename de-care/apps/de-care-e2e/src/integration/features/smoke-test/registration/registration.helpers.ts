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

export const verifyWithRadioID = () => {
    cy.get('[data-e2e="verifyOptionsForm.radioId.field"]').within(() => {
        cy.get('[data-e2e="sxmUITextFormField"]').type('990005109022', { force: true });
    });
    submit('[data-e2e="verifyOptionsForm.continueButton"]');
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

export const urlIncludesPath = (path: string) => {
    return cy.url().then((url) => {
        if (url.includes(path)) {
            return true;
        } else {
            return false;
        }
    });
};

const fillOutSecurityQuestion = (index: number, text: string) => {
    cy.get('sxm-ui-dropdown').eq(index).click({ force: true });
    cy.get('sxm-ui-dropdown')
        .eq(index)
        .within(() => {
            cy.get('[data-e2e="sxmDropDownItem"]').eq(index).click({ force: true });
        });
    cy.get('[data-e2e="sxmUITextFormField"]').eq(index).type(text, { force: true });
};

export const checkNoAccountFound = () => {
    cy.get('h1').should('have.text', 'No account found');
};

export const submit = (tag?: string) => {
    tag ? cy.get(tag).click({ force: true }) : cy.get('button').click({ force: true });
};

export const mockAccountFoundApiCalls = () => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
    cy.sxmMockPasswordValidationSuccess();
    cy.route('POST', `**/identity/registration/flepz`, require('../../../../fixtures/features/smoke-tests/registration/flepz-response-account-found.json'));
    cy.route('POST', `**/account/registration/non-pii`, require('../../../../fixtures/features/smoke-tests/registration/non-pii-account-found.json'));
    cy.route('POST', `**/account/auth-verify-options`, require('../../../../fixtures/features/smoke-tests/registration/verify-options-acount-found.json'));
    cy.route('POST', `**/authenticate/verify-pii-data`, require('../../../../fixtures/features/smoke-tests/registration/auth-verify-pii-data.json'));
    cy.route('GET', `**/utility/security-questions`, require('../../../../fixtures/features/smoke-tests/registration/security-questions.json'));
    cy.route('POST', `**/account/registration/account-profile`, require('../../../../fixtures/features/smoke-tests/registration/account-profile.json'));
    cy.route('POST', `**/account/register`, require('../../../../fixtures/features/smoke-tests/registration/register.json'));
};

export const mockAccountNotFoundApiCalls = () => {
    cy.server();
    cy.sxmMockEnvInfo();
    cy.sxmMockCardBinRanges();
    cy.route('POST', `**/identity/registration/flepz`, require('../../../../fixtures/features/smoke-tests/registration/flepz-response-no-account-found.json'));
};
