import { Before, Then } from '@badeball/cypress-cucumber-preprocessor';
import {
    stubOrganicAccountInfoSystemError,
    stubOrganicAccountInfoUsernameError,
    stubOrganicAccountInfoUsernameInUseError,
    stubOrganicCustomerOffersSuccess,
} from '../common-utils/stubs';
import { fillInAccountInfoAndSubmit, fillInDeviceIdWithRadioIdAndSubmit } from '../common-utils/ui';
import { stubDeviceInfoNewWithVehicleSuccess, stubDeviceValidateNewSuccess } from '../../../../../support/stubs/de-microservices/device';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Customer should get a general system error on the account step after transaction submission
Then(/^a customer goes through the zero cost steps and a system error occurs on purchase transaction$/, () => {
    goThroughTransaction();
    stubOrganicAccountInfoSystemError();
    fillInAccountInfoAndSubmit();
});
Then(/^they should shown a general system error message$/, () => {
    cy.get('#unexpectedProcessingError').should('be.visible');
});

// Scenario: Customer should get a username error on the account step after transaction submission
Then(/^a customer goes through the zero cost steps and a username error occurs on purchase transaction$/, () => {
    goThroughTransaction();
    stubOrganicAccountInfoUsernameError();
    fillInAccountInfoAndSubmit();
});
Then(/^they should be shown a username error message$/, () => {
    cy.get('sxm-ui-email-form-field .invalid-feedback').should('be.visible').and('contain.text', 'Enter a valid email address');
});

// Scenario: Customer should get a username error on the account step after transaction submission
Then(/^a customer goes through the zero cost steps and a username in use error occurs on purchase transaction$/, () => {
    goThroughTransaction();
    stubOrganicAccountInfoUsernameInUseError();
    fillInAccountInfoAndSubmit();
});
Then(/^they should be shown a username in use error message$/, () => {
    cy.get('sxm-ui-email-form-field .invalid-feedback').should('be.visible').and('contain.text', 'in use');
});

const goThroughTransaction = () => {
    stubDeviceValidateNewSuccess();
    stubDeviceInfoNewWithVehicleSuccess();
    stubOrganicCustomerOffersSuccess();
    fillInDeviceIdWithRadioIdAndSubmit();
};
