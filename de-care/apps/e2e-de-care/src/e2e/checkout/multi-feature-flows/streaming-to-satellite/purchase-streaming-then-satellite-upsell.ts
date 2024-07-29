import { Before, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountNonPiiStreamingSubscriptionClosedRadio } from '../../../../support/stubs/de-microservices/account';
import { deviceLookupEnterRadioIdAndSubmit } from './common-utils/ui';
import { stubDeviceValidateNewSuccess } from '../../../../support/stubs/de-microservices/device';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Customer can purchase a digital plan then upsell to a satellite plan using device lookup
Then(/^they should be able to lookup a device by radio id$/, () => {
    stubDeviceValidateNewSuccess();
    stubAccountNonPiiStreamingSubscriptionClosedRadio();
    deviceLookupEnterRadioIdAndSubmit();
});

// Scenario: Customer can purchase a digital plan then upsell to a satellite plan using existing devices
Then(/^they should be able to use an existing device$/, () => {
    cy.get('[data-test="SelectYourRadioFormOption"] input').first().click({ force: true });
    cy.get('[data-test="SelectYourRadioFormSubmit"]').click({ force: true });
});

// Scenario: Customer with existing device can purchase a digital plan then upsell to a satellite plan using device lookup
Then(/^they choose to look up a device that is not listed$/, () => {
    cy.get('[data-test="SelectYourRadioFormOption"] input').last().click({ force: true });
    cy.get('[data-test="SelectYourRadioFormSubmit"]').click({ force: true });
});
