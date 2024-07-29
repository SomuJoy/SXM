import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import {
    deviceValidateErrorShouldBeVisibleAndContain,
    fillInDeviceIdWithRadioIdAndSubmit,
    visitZeroCostSatelliteOrganicWithInvalidPromoCode,
    visitZeroCostSatelliteOrganicWithRedeemedPromoCode,
} from '../common-utils/ui';
import { stubValidatePromoCodeExpired, stubValidatePromoCodeInvalid, stubValidatePromoCodeRedeemed } from '../../../../../support/stubs/de-microservices/offers';
import { stubDeviceInfoNewWithVehicleSuccess, stubDeviceValidateUsedSuccess } from '../../../../../support/stubs/de-microservices/device';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Promo code redeemed message for redeemed promo code
When('a customer visits the page with an redeemed promo code', () => {
    stubValidatePromoCodeRedeemed();
    visitZeroCostSatelliteOrganicWithRedeemedPromoCode();
});
Then('they should be presented with the promo code redeemed page', () => {
    cy.url().should('contain', '/promo-code-redeemed-error');
});

// Scenario: General error page for invalid promo code
When('a customer visits the page with an invalid promo code', () => {
    stubValidatePromoCodeInvalid();
    visitZeroCostSatelliteOrganicWithInvalidPromoCode();
});

// Scenario: General error page for invalid promo code
When('a customer visits the page with an expired promo code', () => {
    stubValidatePromoCodeExpired();
    visitZeroCostSatelliteOrganicWithInvalidPromoCode();
});

// Scenario: Device info that does not qualify for the offer
Then('they enter in device info that does not qualify for the offer', () => {
    stubDeviceValidateUsedSuccess();
    stubDeviceInfoNewWithVehicleSuccess();
    fillInDeviceIdWithRadioIdAndSubmit();
});
Then('they should be presented with an error about device not qualifying for offer', () => {
    deviceValidateErrorShouldBeVisibleAndContain('Device is not eligible');
});
