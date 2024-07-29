import { Before, Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import {
    stubAllPackageDescriptionsSuccess,
    stubOffersCustomerTrialActivationOrganic,
    stubOffersInfoTrialActivationOrganicAA3MOTRIALGGLE,
    stubOffersTrialActivationOrganicAA3MOTRIALGGLE,
} from '../../../support/stubs/de-microservices/offers';
import { startMyTrialUpdateUsecaseSuccess } from '../../checkout/streaming/common-utils/stubs';
import { stubTrialActivationOrganicProspectTokenSuccess } from '../../../support/stubs/de-microservices/trial';
import {
    stubAccountCustomerInfoTrialActivationOrganic,
    stubValidateCustomerInfoAddressAutoCorrectSuccess,
    stubValidatePasswordSuccess,
} from '../../../support/stubs/de-microservices/validate';
import { stubDeviceInfoTrialActivationOrganicDeviceNotUsed, stubDeviceValidateTrialActivationOrganicSuccess } from '../../../support/stubs/de-microservices/device';
import { stubAccountNonPiiTrialActivationOrganic } from '../../../support/stubs/de-microservices/account';
import { enterNewAccountFlepzInfo, enterNewRadioIdAndContinue } from './ui';

Before(() => {
    cy.viewport('iphone-x');
    stubAllPackageDescriptionsSuccess();
    startMyTrialUpdateUsecaseSuccess();
});

// Scenario: Trial Activation Organic for Used Car Branding Type
Given(/^A customer with a closed SiriusXM Trial Radio and attempts to activate$/, () => {
    stubOffersTrialActivationOrganicAA3MOTRIALGGLE();
    stubOffersInfoTrialActivationOrganicAA3MOTRIALGGLE();
    stubOffersCustomerTrialActivationOrganic();
    stubTrialActivationOrganicProspectTokenSuccess();
});
When(/^they hit trial activation targeted url with prospect token and program code$/, () => {
    stubAccountCustomerInfoTrialActivationOrganic();
    stubDeviceValidateTrialActivationOrganicSuccess();
    stubAccountNonPiiTrialActivationOrganic();
    stubDeviceInfoTrialActivationOrganicDeviceNotUsed();

    cy.visit('/activate/trial/flepz?prospecttkn=e1d72d27-62fb-4dcb-8bfb-a988ffe58d13&programCode=AA3MOTRIALGGLE');

    enterNewRadioIdAndContinue();
    stubValidatePasswordSuccess();
    enterNewAccountFlepzInfo();
    stubValidateCustomerInfoAddressAutoCorrectSuccess();
});
Then(/^they should see the activation flow$/, () => {
    cy.get('activation-flow').should('exist');
    cy.get('new-account-form-step').should('exist');
});
