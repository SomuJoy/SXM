import { Before, Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubDeviceInfoOneStepTrialActivation } from '../../../support/stubs/de-microservices/device';
import {
    stubAllPackageDescriptionsSuccess,
    stubCheckEligibilityCaptchaRequiredSuccess,
    stubOffersCustomerOneStepTrialActivation,
    stubOffersInfoSatelliteTargetedSelfPayPromoOfferAsOffersInfoCall,
} from '../../../support/stubs/de-microservices/offers';
import { stubAccountCustomerInfoOneStepTrialActivation, stubAccountNonPiiOneStepTrialActivation } from '../../../support/stubs/de-microservices/account';
import { startMyTrialUpdateUsecaseSuccess } from '../../checkout/streaming/common-utils/stubs';
import { stubUtilityCaptchaNewSuccess } from '../../../support/stubs/de-microservices/utility';

Before(() => {
    cy.viewport('iphone-x');
    stubAllPackageDescriptionsSuccess();
    startMyTrialUpdateUsecaseSuccess();
});

// Scenario: Trial Activation Targeted for Used Car Branding Type
Given(/^A customer with a closed SiriusXM Trial Radio and attempts to activate$/, () => {
    stubDeviceInfoOneStepTrialActivation();
    stubOffersCustomerOneStepTrialActivation();
    stubAccountNonPiiOneStepTrialActivation();
    stubOffersInfoSatelliteTargetedSelfPayPromoOfferAsOffersInfoCall();
});
When(/^they hit trial activation targeted url for used car branding type$/, () => {
    stubAccountCustomerInfoOneStepTrialActivation();
    stubCheckEligibilityCaptchaRequiredSuccess();
    stubUtilityCaptchaNewSuccess();
    cy.visit('/activate/trial?radioId=6901&usedCarBrandingType=SERVICE_LANE');
});
Then(/^they should see the one step activation flow$/, () => {
    cy.get('one-step-activation-flow').should('exist');
});
