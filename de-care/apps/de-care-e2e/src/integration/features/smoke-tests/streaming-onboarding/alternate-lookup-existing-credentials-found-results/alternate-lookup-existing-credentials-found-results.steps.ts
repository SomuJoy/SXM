import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given(/^a customer visits the streaming onboarding URL$/, () => {
    cy.server();
    cy.sxmMockCardBinRanges();
    cy.sxmMockAllPackageDesc();
    cy.route('POST', '**/services/device/validate', require('../../../../../fixtures/features/smoke-tests/streaming-onboarding/device-validate-success.json'));
    cy.route(
        'POST',
        '**/services/identity/device/license-plate',
        require('../../../../../fixtures/features/smoke-tests/streaming-onboarding/license-plate-lookup-success.json')
    );
    cy.route('POST', '**/services/account/non-pii', require('../../../../../fixtures/features/smoke-tests/streaming-onboarding/non-pii-account-is-registered.json'));
    cy.route('POST', '**/services/account/verify', require('../../../../../fixtures/features/smoke-tests/streaming-onboarding/account-verify-success.json'));
    cy.route(
        'POST',
        '**/services/account/streaming-eligibility',
        require('../../../../../fixtures/features/smoke-tests/streaming-onboarding/account-is-streaming-eligible-and-has-credentials.json')
    );
    cy.visit('/onboarding/setup-credentials');
});
And(/^they submit the FLEPZ form with no match data$/, () => {
    cy.route('POST', `**/services/identity/streaming/flepz`, require('../../../../../fixtures/features/smoke-tests/streaming-onboarding/streaming-flepz-no-match.json'));
    // NOTE: These values don't matter here because we mock the endpoint response (it doesn't use the request values).
    //       We just need to fill out the form fields with valid data.
    cy.get('[data-e2e="FlepzFirstNameTextfield"]').type('Mikey', { force: true });
    cy.get('[data-e2e="FlepzLastNameTextfield"]').type('Cypress', { force: true });
    cy.get('[data-e2e="FlepzEmailTextfield"]').type('mikebeetest@testing.com', { force: true });
    cy.get('[data-e2e="FlepzPhoneNumberTextfield"]').type('8059999999', { force: true });
    cy.get('[data-e2e="FlepzZipCodeTextfield"]').type('12345', { force: true });
    cy.get('[data-e2e="FlepzFormSubmitButton"]').click({ force: true });
});

When(/^they submit the radio id lookup form with valid data and have existing credentials$/, () => {
    cy.get('[data-e2e="radioIdLookupTypeOption"] input[type="radio"]').click({ force: true });
    cy.get('[data-e2e="radioIdInput"] [data-e2e="sxmUITextFormField"]').type('12345678', { force: true });
    cy.get('[data-e2e="continueButton"]').click({ force: true });
});
When(/^they submit the vin lookup form with valid data and have existing credentials$/, () => {
    cy.get('[data-e2e="vinLookupTypeOption"] input[type="radio"]').click({ force: true });
    cy.get('[data-e2e="vinInput"] [data-e2e="sxmUITextFormField"]').type('12345678912', { force: true });
    cy.get('[data-e2e="continueButton"]').click({ force: true });
});
When(/^they submit the license plate lookup form with valid data and have existing credentials$/, () => {
    cy.get('[data-e2e="licensePlateLookupTypeOption"] input[type="radio"]').click({ force: true });
    cy.get('[data-e2e="licensePlateInput"] [data-e2e="sxmUITextFormField"]').type('1234567', { force: true });
    cy.get('[data-e2e="stateDropDown"]')
        .click({ force: true })
        .within(() => {
            cy.get('[data-e2e="sxmDropDownItem"]')
                .contains('AK')
                .scrollIntoView()
                .click();
        });
    cy.get('[data-e2e="continueButton"]').click({ force: true });
});

Then(/^they should be navigated to the existing credentials page$/, () => {
    cy.url().should('contain', '/onboarding/setup-credentials/existing-credentials');
});
