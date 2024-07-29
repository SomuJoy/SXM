import { Before, Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import {
    stubAccountSuccess,
    stubAccountWithAudioPriceChangeEligiblePlanSuccess,
    stubAccountWithInfotainmentSuccess,
    stubAccountWithMultipleSubscriptionsSuccess,
    stubAccountWithNicknameSuccess,
    stubAccountWithPriceChangeEligiblePlanSuccess,
    stubAccountWithPlatinumBundleNextPlanSuccess,
    stubNewHotAndTrendingSuccess,
} from '../common-utils/stubs';

import { stubAccountNextBestActionSuccessWithNoActions } from '../../../../support/stubs/de-microservices/account';
import { stubAllPackageDescriptionsSuccess } from '../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../support/stubs/de-microservices/apigateway';
import { stubUtilityCardBinRangesSuccess, stubUtilityEnvInfoSuccess } from '../../../../support/stubs/de-microservices/utility';

Before(() => {
    stubApiGatewayUpdateUseCaseSuccess();
    stubUtilityEnvInfoSuccess();
    stubUtilityCardBinRangesSuccess();
    stubAllPackageDescriptionsSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
});
Given(/^a customer visits the my account experience while logged in$/, () => {
    stubAccountSuccess();
    gotoManageRoute();
});

Given(/^a customer with a device nickname visits the my account experience while logged in$/, () => {
    stubAccountWithNicknameSuccess();
    gotoManageRoute();
});

Given(/^a customer with a infotainment subscription visits the my account experience while logged in$/, () => {
    stubAccountWithInfotainmentSuccess();
    gotoManageRoute();
});

Given(/^a customer with multiple subscriptions visits the my account experience while logged in$/, () => {
    stubAccountWithMultipleSubscriptionsSuccess();
    gotoManageRoute();
});

Given(/^a customer with an account with a price change eligible plan visits the my account experience while logged in$/, () => {
    stubAccountWithPriceChangeEligiblePlanSuccess();
    gotoManageRoute();
});

Given(/^a customer with a one platinum bundle next or forward plans visits the my account experience while logged in$/, () => {
    stubAccountWithPlatinumBundleNextPlanSuccess();
    gotoManageRoute();
});

Given(/^a customer with a audio subscription with a price change eligible plan visits the my account experience while logged in$/, () => {
    stubAccountWithAudioPriceChangeEligiblePlanSuccess();
    gotoManageRoute();
});

Then(/^they should be routed to the dashboard experience$/, () => {
    cy.url().should('contain', '/dashboard');
});

function gotoManageRoute() {
    stubAccountNextBestActionSuccessWithNoActions();
    stubNewHotAndTrendingSuccess();
    cy.visit('/account/manage');
}

export function beforeVisitSection() {
    stubApiGatewayUpdateUseCaseSuccess();
    stubUtilityEnvInfoSuccess();
    stubAllPackageDescriptionsSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
}
