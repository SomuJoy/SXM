// import { Before, When, Then } from '@badeball/cypress-cucumber-preprocessor';
// import {stubAccountUpgradeVipSatelliteCommonWithOneNonVipPlan} from "../../../../../support/stubs/de-microservices/account";

// TODO: need to add cypress test cases once streaming selection is on

// Before(() => {
//     cy.stubCardBinRangesSuccess();
//     cy.stubAllPackageDescriptionsSuccess();
//     stubApiGatewayUpdateUseCaseSuccess();
//     cy.stubOffersSuccessSatellitePlatinumVIP();
//     cy.viewport('iphone-x');
// });

// // Common steps
// When(/^a customer visits the upgrade vip organic page with a valid program code$/, () => {
//     cy.visit(`/subscribe/upgrade-vip/flepz?tbView=DM&programcode=PLTOFFERVIP`);
// });

// // Scenario: Experience loads VIP offer
// Then(/^they should be presented with the VIP offer$/, () => {
//     cy.primaryPackageCardIsVisibleAndContains('SiriusXM Platinum VIP');
// });

// // Scenario: Customer can select create new streaming login radio button
// Then(/^they lookup an account that does not have an active VIP subscription$/, () => {
//     cy.get('[data-test="sxmUIRadioIdFormField"]').clear().type('990003318030');
//     cy.get('[data-test="sxmUIAccountNumberFormField"]').clear().type('10000210226');
//     cy.stubDeviceValidateUsedSuccess();
//     stubAccountUpgradeVipSatelliteCommonWithOneNonVipPlan();
//     cy.stubOffersCustomerSuccessSatellitePlatinumVIP();
//     cy.get('[data-test="RadioAndAccountLookupForm.submitButton"]').click();
//     cy.get('[data-e2e="accountLookupStepModal.submitButton"]').click();
// });

// // Then(/^they choose to click create new streamng login$/, () => {
// //     cy.get('[data-test="firstStepForm.createStreamingLogin"]').click({force:true});
// //     cy.get('[data-test="firstStepForm.continueButton"]').click({force:true});
// // });
// Then(/^they should pop upemail login modal pops up$/, () => {
//     cy.get('sxm-ui-modal').get('div').should('have.class', 'modal-cover open');
// });
