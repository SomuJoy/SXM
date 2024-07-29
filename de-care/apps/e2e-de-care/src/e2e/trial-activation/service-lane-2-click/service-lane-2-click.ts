import { Before, Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubUtilityCardBinRangesSuccess, stubUtilityEnvInfoSuccess, stubUtilityLogMessageSuccess } from '../../../support/stubs/de-microservices/utility';
import { stubAllPackageDescriptionsSuccess, stubOffersServiceLane2ClickSuccess } from '../../../support/stubs/de-microservices/offers';
import { stubTrialServiceLane2ClickTokenSuccess } from '../../../support/stubs/de-microservices/trial';
import { startMyTrialUpdateUsecaseSuccess } from '../../checkout/streaming/common-utils/stubs';
import { stubAcountNonPiiTrialActivationServiceLaneTwoClick } from '../../../support/stubs/de-microservices/account';
import { stubValidateCustomerInfoServiceLaneTwoClickValidAddress } from '../../../support/stubs/de-microservices/validate';

const token = '765915e5-0de6-4612-9b6c-713ceb0c7875';
const corpId = 90005;

Before(() => {
    cy.viewport('iphone-x');
    stubUtilityCardBinRangesSuccess();
    stubAllPackageDescriptionsSuccess();
    startMyTrialUpdateUsecaseSuccess();
    stubUtilityEnvInfoSuccess();
});

Given(/^A customer with a closed SiriusXM Trial Radio and attempts to activate$/, () => {
    stubOffersServiceLane2ClickSuccess();
    stubTrialServiceLane2ClickTokenSuccess();
});

Then(/^they should see the confirmation page$/, () => {
    cy.get('de-care-trial-activation-sl2c-confirmation').should('exist');
});

// Scenario: Service lane 2 click new vehicle
When(/^they hit the service lane 2 click url for new vehicle$/, () => {
    stubAcountNonPiiTrialActivationServiceLaneTwoClick();
    stubValidateCustomerInfoServiceLaneTwoClickValidAddress();
    cy.visit(`activate/trial/service-lane?tkn=${token}&corpId=${corpId}`);
});

// Scenario: Service lane 2 click used vehicle
When(/^they hit the service lane 2 click url for used vehicle$/, () => {
    stubAcountNonPiiTrialActivationServiceLaneTwoClick();
    stubValidateCustomerInfoServiceLaneTwoClickValidAddress();
    cy.visit(`activate/trial/used-vehicle?tkn=${token}&corpId=${corpId}`);
});
