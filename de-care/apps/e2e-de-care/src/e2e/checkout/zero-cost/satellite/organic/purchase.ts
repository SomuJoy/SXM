import { Before, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubOrganicAccountInfoSuccess, stubOrganicCustomerOffersSuccess } from '../common-utils/stubs';
import {
    deviceInstructionsShouldContainRadioIdInfo,
    deviceInstructionsShouldContainVehicleInfo,
    fillInAccountInfoAndSubmit,
    fillInDeviceIdWithRadioIdAndSubmit,
    refreshSignalFormShouldBeVisible,
    submitRefreshSignal,
} from '../common-utils/ui';
import { stubAccountRegisterSuccess } from '../../../../../support/stubs/de-microservices/account';
import { stubValidatePasswordSuccess } from '../../../../../support/stubs/de-microservices/validate';
import {
    stubDeviceInfoNewNoVehicleSuccess,
    stubDeviceInfoNewWithVehicleSuccess,
    stubDeviceRefreshSuccess,
    stubDeviceValidateNewSuccess,
} from '../../../../../support/stubs/de-microservices/device';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Can complete zero cost checkout
Then('they successfully go through the purchase steps', () => {
    stubDeviceValidateNewSuccess();
    stubDeviceInfoNewWithVehicleSuccess();
    stubOrganicCustomerOffersSuccess();
    fillInDeviceIdWithRadioIdAndSubmit();
    deviceInstructionsShouldContainVehicleInfo();
    stubOrganicAccountInfoSuccess();
    fillInAccountInfoAndSubmit();
});
Then('they should be presented with the device activation page', () => {
    refreshSignalFormShouldBeVisible();
});
Then('they should be able to send the refresh signal and register the account', () => {
    stubDeviceRefreshSuccess();
    submitRefreshSignal();
    stubValidatePasswordSuccess();
    stubAccountRegisterSuccess();
    cy.fillOutAndSubmitAccountRegistrationForm({ includePassword: true });
});

// Successful device lookup with no vehicle displays radio id text
Then('they enter in valid device info that qualifies for the offer and does not have vehicle info', () => {
    stubDeviceValidateNewSuccess();
    stubDeviceInfoNewNoVehicleSuccess();
    stubOrganicCustomerOffersSuccess();
    fillInDeviceIdWithRadioIdAndSubmit();
});
Then('they should be presented with text copy that includes the radio id', () => {
    deviceInstructionsShouldContainRadioIdInfo();
});
