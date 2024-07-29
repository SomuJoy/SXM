import {
    cyGet2faModalVerifyOptionsForm,
    cyGetAccountSubscriptionsInfoVerifyLink,
    cyGetE2eRegistrationIdentificationFlepzForm,
    cyGetE2eRegistrationIdentificationFlepzFormContinueButton,
    cyGetE2eRegistrationIdentificationHaveAccount,
    cyGetE2eRegistrationIdentificationInstructions,
    cyGetE2eRegistrationIdentificationTitle,
    cyGetFlepzEmailTextfield,
    cyGetFlepzFirstNameTextfield,
    cyGetFlepzLastNameTextfield,
    cyGetFlepzPhoneNumberTextfield,
    cyGetFlepzZipCodeTextfield,
    cyGetVerifyOptionsFormPhoneNumberLabel,
    cyGetVerifyOptionsFormRadioIdLabel,
    cyGetVerifyOptionsFormRadioIdField,
    cyGetVerifySingleAccountButton,
    mockMultiAccountRoutes,
    mockNoAccountRoutes,
    mockSingleAccountNoPhoneRoutes,
    mockVerifyPhoneNumberSuccess,
    mockSingleAccountRoutes,
    mockVerifyAccountNumberSuccess,
    cyGetVerifyOptionsFormContinueButton,
    cyGetVerifyOptionsFormAccountNumberLabel,
    cyGetVerifyOptionsFormAccountNumberField,
    cyGetVerifyOptionsFormPhoneNumberField,
    cyGetVerifyOptionsFormPhoneNumberAcceptTerms,
    cyGetCheckboxFormField,
    cyGetSecurityCodeVerificationFormSecurityCodeField,
    cyGetSecurityCodeVerificationFormSubmitSecurityCode
} from '@de-care/de-care-use-cases/account/e2e';
import {
    getAliasForURL,
    sxmCheckPageLocation,
    sxmEnsureNoMissingTranslations,
    sxmReplaceMockFromHAR,
    sxmWaitForSpinner,
    cyGetRadioOptionLabel,
    cyGetSxmUIPhoneNumber,
    cyGetSxmUITextFormField,
    mockRouteForCardBinRanges,
    mockRouteForAllPackageDescriptions
} from '@de-care/shared/e2e';
import { cyGetSxmUINumericFormField } from '@de-care/shared/sxm-ui/e2e';

import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

let mockRoutes: any;

Before(() => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
});

Given('the customer is trying to register with multiple accounts', () => {
    mockRoutes = mockMultiAccountRoutes();
});

And('they fill out the flepz form', () => {
    cyGetE2eRegistrationIdentificationFlepzForm().should('be.visible');

    cyGetFlepzFirstNameTextfield().type('Paula', { force: true });
    cyGetFlepzLastNameTextfield().type('Myo', { force: true });
    cyGetFlepzEmailTextfield().type('paula@siriusxm.com', { force: true });
    cyGetFlepzPhoneNumberTextfield().type('8052222222', { force: true });
    cyGetFlepzZipCodeTextfield().type('10020', { force: true });

    cyGetE2eRegistrationIdentificationFlepzFormContinueButton().click();
    sxmCheckPageLocation('/account/registration/verify');
});

When('they click verify on an account with all options', () => {
    cyGetAccountSubscriptionsInfoVerifyLink()
        .first()
        .click();
});

When('they click verify on an account with no radioId', () => {
    sxmReplaceMockFromHAR(mockRoutes, getAliasForURL('POST', '/services/account/auth-verify-options'), 1);
    cyGetAccountSubscriptionsInfoVerifyLink()
        .first()
        .click();
});

Then('they should see a modal with all options showing', () => {
    cyGet2faModalVerifyOptionsForm().should('be.visible');

    cyGetVerifyOptionsFormPhoneNumberLabel().should('be.visible');
    cyGetVerifyOptionsFormRadioIdLabel().should('be.visible');
    cyGetVerifyOptionsFormAccountNumberLabel().should('be.visible');
});

Then('they should see a modal with phone and account number, but no radioId', () => {
    cyGet2faModalVerifyOptionsForm().should('be.visible');

    cyGetVerifyOptionsFormPhoneNumberLabel().should('be.visible');
    cyGetVerifyOptionsFormRadioIdLabel().should('not.be.visible');
    cyGetVerifyOptionsFormAccountNumberLabel().should('be.visible');
});

When('they visit the registration page', () => {
    cy.visit('/account/registration');
    sxmWaitForSpinner();
});

Then('they should see a listing of all accounts', () => {
    sxmEnsureNoMissingTranslations();
    sxmCheckPageLocation('/account/registration/verify');
});

Given('the customer is trying to register with single account', () => {
    mockSingleAccountRoutes();
});

Given('the customer is trying to register with a single account with radioId but no phone number', () => {
    mockSingleAccountNoPhoneRoutes();
});

When('they click the verify button', () => {
    cyGetVerifySingleAccountButton().click();
});

Then('they should see a modal with radioId and account number, but no phone number', () => {
    cyGet2faModalVerifyOptionsForm().should('be.visible');

    cyGetVerifyOptionsFormPhoneNumberLabel().should('not.be.visible');
    cyGetVerifyOptionsFormRadioIdLabel().should('be.visible');
    cyGetVerifyOptionsFormAccountNumberLabel().should('be.visible');
});

Then('they should see only one account', () => {
    sxmEnsureNoMissingTranslations();

    sxmCheckPageLocation('/account/registration/verify');
});

Given('the customer is trying to register with no account', () => {
    mockNoAccountRoutes();
});

Then('they should see an alternative authentication page', () => {
    sxmEnsureNoMissingTranslations();

    sxmCheckPageLocation('/account/registration/verify');
});

And('they see the header and main copy', () => {
    cyGetE2eRegistrationIdentificationTitle().should('be.visible');
    cyGetE2eRegistrationIdentificationInstructions().should('be.visible');
    cyGetE2eRegistrationIdentificationHaveAccount().should('be.visible');
});

Given('the customer is trying to register with a single account with radioId', () => {
    mockVerifyAccountNumberSuccess();
});

Then('they should see a modal with radioId and account number, but no phone number', () => {
    cyGet2faModalVerifyOptionsForm().should('be.visible');

    cyGetVerifyOptionsFormPhoneNumberLabel().should('not.be.visible');
    cyGetVerifyOptionsFormRadioIdLabel().should('be.visible');
    cyGetVerifyOptionsFormAccountNumberLabel().should('be.visible');
});
And('they choose radioId in the modal', () => {
    cyGetVerifyOptionsFormRadioIdLabel()
        .should('be.visible')
        .within(() => {
            cyGetRadioOptionLabel().click({ force: true });
        });
});

And('they enter a valid radioId', () => {
    cyGetVerifyOptionsFormRadioIdField().within(() => {
        cyGetSxmUITextFormField().type('12345678', { force: true });
    });
    cyGetVerifyOptionsFormContinueButton().click({ force: true });
});

Then('they should be taken to the complete-registration page', () => {
    sxmCheckPageLocation('/account/registration/register');
});

Given('the customer is trying to register with a single account with account number', () => {
    mockVerifyAccountNumberSuccess();
});

And('they choose account number in the modal', () => {
    cyGetVerifyOptionsFormAccountNumberLabel()
        .should('be.visible')
        .within(() => {
            cyGetRadioOptionLabel().click({ force: true });
        });
});

And('they enter a valid account number', () => {
    cyGetVerifyOptionsFormAccountNumberField().within(() => {
        cyGetSxmUITextFormField().type('12345678', { force: true });
    });
    cyGetVerifyOptionsFormContinueButton().click({ force: true });
});

Then('they should be taken to the complete-registration page', () => {
    sxmCheckPageLocation('/account/registration/register');
});

Given('the customer is trying to register with a single account by phone', () => {
    mockVerifyPhoneNumberSuccess();
});

And('they choose phone number in the modal', () => {
    cyGetVerifyOptionsFormPhoneNumberLabel()
        .should('be.visible')
        .within(() => {
            cyGetRadioOptionLabel().click({ force: true });
        });
});

And('they enter a valid phone number', () => {
    cyGetVerifyOptionsFormPhoneNumberField().within(() => {
        cyGetSxmUIPhoneNumber().type('9994445555', { force: true });
    });
});

And('they accept the terms', () => {
    cyGetVerifyOptionsFormPhoneNumberAcceptTerms().within(() => {
        cyGetCheckboxFormField().check({ force: true });
    });

    cyGetVerifyOptionsFormContinueButton().click({ force: true });
});

And('they enter a valid security code', () => {
    cyGetSecurityCodeVerificationFormSecurityCodeField().within(() => {
        cyGetSxmUINumericFormField().type('123456', { force: true });
    });

    cyGetSecurityCodeVerificationFormSubmitSecurityCode().click({ force: true });
});
