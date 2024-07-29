import { When } from '@badeball/cypress-cucumber-preprocessor';
import { stubDeviceValidateRadioIdNotFound, stubDeviceValidateUsedSuccess } from '../../../../support/stubs/de-microservices/device';
import {
    stubAccountAcscOrganicSuccess,
    stubAccountNonPiiSatelliteOrganicWithSelfPaySubscription,
    stubAccountNonPiiSatelliteTargetedWithTrialSubscription,
} from '../../../../support/stubs/de-microservices/account';
import { stubDeviceInfoActiveSelfPayNoVehicle, stubDeviceInfoActiveTrialNoVehicle } from './common-utils/stubs';

When(/^they enter a an invalid radio they should be presented with an error$/, () => {
    stubDeviceValidateRadioIdNotFound();
    cy.get('[data-test="radioIdInput"]').type('990003359555');
    cy.get('[data-test="continueButton"]').click({ force: true });
    cy.get('[data-test="ErrorMessageInvalidRadioId"]').should('be.visible');
});

When(/^they enter an active trial they should be routed to AC_SC$/, () => {
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteTargetedWithTrialSubscription();
    stubDeviceInfoActiveTrialNoVehicle();
    stubAccountAcscOrganicSuccess();
    cy.get('[data-test="radioIdInput"]').type('990003359555');
    cy.get('[data-test="continueButton"]').click({ force: true });
});

When(/^they enter an active self-pay they should be routed to Transfer Error page$/, () => {
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteOrganicWithSelfPaySubscription();
    stubDeviceInfoActiveSelfPayNoVehicle();
    stubAccountAcscOrganicSuccess();
    cy.get('[data-test="radioIdInput"]').type('990003359555');
    cy.get('[data-test="continueButton"]').click({ force: true });
});
