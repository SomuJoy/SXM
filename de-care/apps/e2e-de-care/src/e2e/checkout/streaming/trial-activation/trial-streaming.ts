import { And, Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import {
    offersResponseFromPromocode,
    renewalPlanCodeSuccessResponse,
    startMyTrialOffersInfoSuccess,
    startMyTrialOffersSuccess,
    startMyTrialRenewalOffersSuccess,
    startMyTrialStreamingSuccess,
    startMyTrialUpdateUsecaseSuccess,
    startMyTrialUtilityCardBinRangesSuccess,
    stubCheckEligibilityCaptchadSuccess,
    stubOffersStreamingCustomerSuccess,
    stubValidateCustomerInfoEmailSuccess,
    stubValidatePromoCodeSuccess,
    successResponseFromInfo,
    validateAccountLookupForm,
    validateTrialPasswordSuccess,
} from '../common-utils/stubs';
import {
    fillOutStartMyTrial,
    fillOutAccountEmailForm,
    submitAccountLookupForm,
    visitStreamingTrialActivationURL,
    confirmStartMyTrialButton,
    visitDefaultOfferPage,
} from '../common-utils/ui';
import { stubAllPackageDescriptionsSuccess } from '../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../support/stubs/de-microservices/apigateway';
import { stubIdentityCustomerEmailSuccess } from '../../../../support/stubs/de-microservices/identity';

Before(() => {
    cy.viewport('iphone-x');
    stubApiGatewayUpdateUseCaseSuccess();
    stubAllPackageDescriptionsSuccess();
});

// Scenario: When customer have a closed subscription account then he should get fallback offer
When(/^a user visits trial activation streaming url then they will get offer based on promocode$/, () => {
    stubValidatePromoCodeSuccess();
    offersResponseFromPromocode();
    renewalPlanCodeSuccessResponse();
    successResponseFromInfo();
    visitStreamingTrialActivationURL();
});
Then(/^the user have to enter closed subscription email id and continue the process$/, () => {
    stubOffersStreamingCustomerSuccess();
    stubCheckEligibilityCaptchadSuccess();
    stubValidateCustomerInfoEmailSuccess();
    stubIdentityCustomerEmailSuccess();
    fillOutAccountEmailForm();
    submitAccountLookupForm();
    validateAccountLookupForm();
});
Then(/^user has to fill out account info and login info$/, () => {
    fillOutStartMyTrial();
    validateTrialPasswordSuccess();
});
And(/^click on start my trial button$/, () => {
    confirmStartMyTrialButton();
    startMyTrialStreamingSuccess();
    startMyTrialUpdateUsecaseSuccess();
    startMyTrialUtilityCardBinRangesSuccess();
    startMyTrialOffersSuccess();
    startMyTrialRenewalOffersSuccess();
    startMyTrialOffersInfoSuccess();
});
Then(/^it will navigate to default fallback offer$/, () => {
    visitDefaultOfferPage();
});
