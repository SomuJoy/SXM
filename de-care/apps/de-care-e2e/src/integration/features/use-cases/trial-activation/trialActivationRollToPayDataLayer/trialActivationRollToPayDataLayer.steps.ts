import {
    cyGetAddress,
    cyGetCcExp,
    cyGetCcName,
    cyGetCcNum,
    cyGetCity,
    cyGetCreateAccountSubmitButton,
    cyGetEmailField,
    cyGetPaymentInfoFormGroup,
    cyGetPhoneNumberField,
    cyGetState,
    cyGetTrialActivationRtpCreateAccountComponent,
    cyGetCompleteMyOrderButton,
    cyGetCheckButtonAcceptOffer,
    cyGetTrialActivationRtpReviewComponent,
    mockNOUVRtp,
    dataLayerHasRTPTrialCreateAccountPageRecord,
    dataLayerHasCustomerTypeRecord,
    dataLayerHasRecordForSessionId,
    dataLayerHasRecordForTransactionId,
    dataLayerHasRecordForRadioId,
    dataLayerHasRecordForProgramCode,
    dataLayerHasRecordForPromoCode,
    dataLayerHasRecordForDeviceStatus,
    dataLayerHasRTPTrialReviewPageRecord
} from '@de-care/de-care-use-cases/trial-activation/e2e';
import {
    cyGetSxmUIEmail,
    cyGetSxmUIEmailLabel,
    cyGetSxmUIPhoneNumber,
    cyGetSxmUIPhoneNumberLabel,
    cyGetSxmUITextFormField,
    cyGetSxmUITextFormFieldLabel,
    mockRouteForAllPackageDescriptions,
    mockRouteForCardBinRanges,
    sxmWaitForSpinner,
    cyGetE2ECreditCardNumberInputUnmasked,
    cyGetSxmDropDownItem,
    sxmCheckPageLocation
} from '@de-care/shared/e2e';
import { Given, Then, When, And } from 'cypress-cucumber-preprocessor/steps';

Given('the customer lands on the trial activation RTP create account page', () => {
    cy.server();
    mockRouteForCardBinRanges();
    mockRouteForAllPackageDescriptions();
    mockNOUVRtp();
});

When('they enter PHX with a valid radioId', () => {
    cy.visit(
        `/activate/trial/rtp/?radioId=3556&usedCarBrandingType=OTHERS&programCode=3MOAAFREE&redirectUrl=https:%2F%2Fdex-dev.corp.siriusxm.com%2Fdvgllvdexoac05-17564-care%2F%3Fprogramcode%3D3MOAAFREE`
    );
    sxmWaitForSpinner();
});

When('they submit the create-account form with valid data', () => {
    cyGetTrialActivationRtpCreateAccountComponent().within(() => {
        cyGetEmailField().within(() => {
            cyGetSxmUIEmailLabel().click();
            cyGetSxmUIEmail().type('paula.myo@siriusxm.com');
        });
        cyGetPhoneNumberField().within(() => {
            cyGetSxmUIPhoneNumberLabel().click();
            cyGetSxmUIPhoneNumber().type('2223333333');
        });

        cyGetPaymentInfoFormGroup().within(() => {
            cyGetAddress().within(() => {
                cyGetSxmUITextFormFieldLabel().click();
                cyGetSxmUITextFormField().type('1 River Rd');
            });

            cyGetCity().within(() => {
                cyGetSxmUITextFormFieldLabel().click();
                cyGetSxmUITextFormField().type('Schenectady');
            });

            cyGetState()
                .click({ force: true })
                .within(() => {
                    cyGetSxmDropDownItem()
                        .contains('NY')
                        .click({ force: true });
                });

            cyGetCcName().within(() => {
                cyGetSxmUITextFormFieldLabel().click();
                cyGetSxmUITextFormField().type('Paula Myo');
            });

            cyGetCcNum().within(() => {
                cyGetE2ECreditCardNumberInputUnmasked().type('4111111111111111');
            });

            cyGetCcExp()
                .click()
                .type('02/22');
        });

        cyGetCreateAccountSubmitButton().click({ force: true });
    });
});

Then('there should be a track event for the page loaded', () => {
    dataLayerHasRTPTrialCreateAccountPageRecord();
});

And('there should be a record for the radio id', () => {
    dataLayerHasRecordForRadioId('3556');
});

And('there should be a record for the program code', () => {
    dataLayerHasRecordForProgramCode('3MOAAFREE');
});

And('there should be a record for the promo code', () => {
    dataLayerHasRecordForPromoCode('SA3MOAAFREE');
});

And('there should be a record for the device status', () => {
    dataLayerHasRecordForDeviceStatus('Closed');
});

And('there should be a record for the customer type', () => {
    dataLayerHasCustomerTypeRecord();
});

And('there should be a record for the session id', () => {
    dataLayerHasRecordForSessionId('dcb05a3e-e6b5-4666-8bd9-5c3ce7fe7726');
});

And('there should be a record for the transaction id', () => {
    dataLayerHasRecordForTransactionId();
});

Then('they should reach step 3 of 3', () => {
    sxmCheckPageLocation('/activate/trial/rtp/review');
    sxmWaitForSpinner();
});

Then('there should track an event for the review page loaded', () => {
    dataLayerHasRTPTrialReviewPageRecord();
});

When('they complete the order and reach the confirmation page', () => {
    cyGetTrialActivationRtpReviewComponent().within(() => {
        cyGetCheckButtonAcceptOffer().click();
        cyGetCompleteMyOrderButton().click();
    });
});

Then('they should reach the confirmation page', () => {
    sxmCheckPageLocation('/activate/trial/rtp/confirmation');
    sxmWaitForSpinner();
});
