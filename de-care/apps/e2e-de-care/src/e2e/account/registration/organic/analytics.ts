import { Before, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { fillOutFlepzFormAndSubmit, visitRegistrationOrganic } from './common-utils/ui';

import {
    stubAccountAuthVerifyOptionsRadioIdAccountNumberSuccess,
    stubAccountRegistrationAccountProfileEmailNotEligibleForUsername,
} from '../../../../support/stubs/de-microservices/account';

import { stubAccountRegistrationNonPiiSuccess } from '../../../../support/stubs/de-microservices/account';
import { stubIdentityRegistrationFlepzOneAccountFound } from '../../../../support/stubs/de-microservices/identity';
import { stubAuthenticateVerifyPiiDataSuccess } from '../../../../support/stubs/de-microservices/authenticate';
import { stubUtilitySecurityQuestionsSuccess } from '../../../../support/stubs/de-microservices/utility';
import { stubValidateCustomerInfoUsernameInvalid, stubValidatePasswordSuccess } from '../../../../support/stubs/de-microservices/validate';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Analytics event for username in use from credentials form
When(/^a user visits the registration page and gets to the credentials step$/, () => {
    visitRegistrationOrganic();
    stubIdentityRegistrationFlepzOneAccountFound();
    fillOutFlepzFormAndSubmit();
    stubAccountRegistrationNonPiiSuccess();
    stubAccountAuthVerifyOptionsRadioIdAccountNumberSuccess();
    stubAuthenticateVerifyPiiDataSuccess();
    stubUtilitySecurityQuestionsSuccess();
    stubAccountRegistrationAccountProfileEmailNotEligibleForUsername();

    // TODO: Figure out why customer-info is getting called during the security questions step (bug in Registration feature experience)!
    stubValidateCustomerInfoUsernameInvalid('customerInfoUsernameInvalidUnintendedCall');

    cy.get('[data-test="verifySingleAccountButton"]').click();
    cy.get('[data-test="verifyOptionsForm.radioId.field"] input').clear().type('CHT000WJ');
    cy.get('[data-test="verifyOptionsForm.continueButton"]').click();
    cy.fillOutSecurityQuestions();
    cy.get('[data-test="registrationForm.continueToNextStepButton"]').click();
});
Then(/^they submit the credentials form with empty field values$/, () => {
    cy.get('[data-test="usernameFormField"]').clear();
    cy.get('[data-test="sxmUIPassword"]').clear().blur();
    cy.get('[data-test="registrationForm.completeRegistrationButton"]').click();
});
Then(/^analytics events should exist for invalid username and password$/, () => {
    cy.appEventDataContainsUserErrors(['Auth - Missing or invalid email or username', 'Auth - Missing or invalid email or username', 'Auth - Missing or invalid password']);
});
Then(/^they submit the credentials form with a username that is in use$/, () => {
    stubValidateCustomerInfoUsernameInvalid();
    stubValidatePasswordSuccess();
    cy.get('[data-test="usernameFormField"]').clear().type('sometest@siriusxm.com');
    cy.get('[data-test="sxmUIPassword"]').clear().type('@LKJpoi123').blur();
    cy.get('[data-test="registrationForm.completeRegistrationButton"]').click();
});
Then(/^an analytics event should exist for the username in use result$/, () => {
    cy.wait('@customerInfoUsernameInvalid').then(() => {
        cy.appEventDataContainsUserErrors(['Auth - Username in use or is not allowed']);
    });
});
