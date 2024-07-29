import { Before, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { fillOutSignInFormAndSubmit, visitSonosActivationURL, visitSonosRegisteredPage, visitSonosSignInPage } from '../common-utils/ui';
import { stub10FootDeviceRegister, stub10FootDeviceValidateActivationCodeFound } from '../../../../support/stubs/de-microservices/10footdevice';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Customer should get to sign in page when activation code is Valid
When(/^a user visits the activation code url$/, () => {
    visitSonosActivationURL();
    stub10FootDeviceValidateActivationCodeFound();
});
Then(/^they should land on the sign in page$/, () => {
    visitSonosSignInPage();
});
Then(/^when they update the sign in form$/, () => {
    fillOutSignInFormAndSubmit();
    stub10FootDeviceRegister();
});
Then(/^they should land on the confirmation page$/, () => {
    visitSonosRegisteredPage();
});
