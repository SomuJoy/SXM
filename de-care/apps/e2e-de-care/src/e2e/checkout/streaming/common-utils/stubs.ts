import {
    stubCheckEligibilityCaptchaNotRequiredSuccess,
    stubCheckEligibilityCaptchaRequiredSuccess,
    stubOffersCheckEligibilityStreamingStreamingCommonNotEligibleSuccess,
    stubOffersCheckEligibilityStreamingStreamingCommonSuccess,
    stubOffersCustomerStreamingCommonFallback,
    stubOffersImagesAmzDotGen4TransparentBg,
    stubOffersInfoStreamingCommonFallback,
    stubOffersInfoStreamingCommonForUpsellTermAsOffersInfoForUpsell,
    stubOffersSuccessDigitalRtpFree,
    stubOffersUpsellInfoStreamingCommonTermOnly,
    stubOffersUpsellStreamingCommonTermOnlyAsGetUpsells,
} from '../../../../support/stubs/de-microservices/offers';
import {
    stubIdentityCustomEmailStreamingCommonExistingMultipleWithAndWithoutFollowOn,
    stubIdentityCustomerEmailStreamingCommonExistingMultipleStreaming,
    stubIdentityCustomerEmailStreamingCommonExistingSingleStreaming,
    stubIdentityCustomerEmailStreamingCommonExistingSingleTrial,
    stubIdentityCustomerEmailSuccess,
} from '../../../../support/stubs/de-microservices/identity';
import { stubUtilityCaptchaNewSuccess } from '../../../../support/stubs/de-microservices/utility';
import { stubValidatePasswordSuccess } from '../../../../support/stubs/de-microservices/validate';

export const stubAccountLookupSuccess = () => {
    stubValidatePasswordSuccess();
    stubIdentityCustomerEmailSuccess();
    cy.intercept('POST', '**/services/validate/customer-info', { fixture: 'de-microservices/validate/customer-info/streaming-common_success.json' });
};
export const stubAccountLookupExistingSingleStreaming = () => {
    stubValidatePasswordSuccess();
    stubIdentityCustomerEmailStreamingCommonExistingSingleStreaming();
};
export const stubAccountLookupExistingMultipleStreaming = () => {
    stubValidatePasswordSuccess();
    stubIdentityCustomerEmailStreamingCommonExistingMultipleStreaming();
};
export const stubAccountLookupExistingSingleTrial = () => {
    stubValidatePasswordSuccess();
    stubIdentityCustomerEmailStreamingCommonExistingSingleTrial();
};
export const stubAccountLookupExistingMultipleWithAndWithoutFollowOn = () => {
    stubValidatePasswordSuccess();
    stubIdentityCustomEmailStreamingCommonExistingMultipleWithAndWithoutFollowOn();
};
export const stubPaymentInfoSuccess = () => {
    cy.intercept('POST', '**/services/validate/customer-info', { fixture: 'de-microservices/validate/customer-info/streaming-common_payment-success.json' });
    stubOffersCheckEligibilityStreamingStreamingCommonSuccess();
};
export const stubIneligiblePaymentInfoCalls = () => {
    cy.intercept('POST', '**/services/validate/customer-info', { fixture: 'de-microservices/validate/customer-info/streaming-common_payment-success.json' });
    stubOffersCheckEligibilityStreamingStreamingCommonNotEligibleSuccess();
    stubOffersCustomerStreamingCommonFallback();
    stubOffersInfoStreamingCommonFallback();
};
export const stubCaptchaNotRequired = () => {
    stubCheckEligibilityCaptchaNotRequiredSuccess();
};
export const stubCaptchaRequired = () => {
    stubCheckEligibilityCaptchaRequiredSuccess();
    stubUtilityCaptchaNewSuccess();
};

export const stubOfferAndUpsellsTermOnly = () => {
    stubOffersUpsellStreamingCommonTermOnlyAsGetUpsells();
    stubOffersUpsellInfoStreamingCommonTermOnly();
    // NOTE: We need to stub the second offers info call first before we stub the lead offers info because Cypress handles these in reverse order
    stubOffersInfoStreamingCommonForUpsellTermAsOffersInfoForUpsell();
    stubOffersImagesAmzDotGen4TransparentBg();
    // Now we can stub the lead offer
    stubOffersSuccessDigitalRtpFree();
};

// export const stubOfferAndSatelliteAddCardUpsell = () => {
// TODO: if needed, add these stubs to the support/stubs/offers.ts file as stub functions
//     cy.intercept('POST', '**/services/offers/upsell', { fixture: 'de-microservices/offers/upsell/streaming-common_satellite.json' }).as('getUpsells');
//     cy.intercept('POST', '**/services/offers/upsell/info', { fixture: 'de-microservices/offers/upsell/info/streaming-common_satellite.json' });
//     cy.intercept({ method: 'POST', url: '**/services/offers/info', times: 1 }, { fixture: 'de-microservices/offers/info/streaming-common_for-upsell-satellite.json' }).as(
//         'offersInfoForUpsell'
//     );
// };

export const stubValidatePromoCodeSuccess = () => {
    cy.intercept('POST', '**/services/offers/promocode/validate', { fixture: 'de-microservices/checkout/streaming/trial-activation/validate-promocode-success.json' });
};

export const offersResponseFromPromocode = () => {
    cy.intercept('POST', '**/services/offers', { fixture: 'de-microservices/checkout/streaming/trial-activation/validate-promocode-offers-response.json' });
};

export const renewalPlanCodeSuccessResponse = () => {
    cy.intercept('POST', '**/services/offers/renewal', { fixture: 'de-microservices/checkout/streaming/trial-activation/renewal-plancode-success-response.json' });
};

export const successResponseFromInfo = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/checkout/streaming/trial-activation/info-plancode-success-response.json' });
};

export const validateAccountLookupForm = () => {
    cy.intercept('POST', '**/services/identity/customer/email', { fixture: 'de-microservices/checkout/streaming/trial-activation/validate-email-success.json' });
};

export const stubOffersStreamingCustomerSuccess = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: 'de-microservices/checkout/streaming/trial-activation/trial-streaming-customer-success.json' });
};

export const stubCheckEligibilityCaptchadSuccess = () => {
    cy.intercept('POST', '**/services/check-eligibility/captcha', { fixture: 'de-microservices/checkout/streaming/trial-activation/trial-streaming-captcha-success.json' });
};

export const stubValidateCustomerInfoEmailSuccess = () => {
    cy.intercept('POST', '**/services/validate/customer-info', { fixture: `de-microservices/checkout/streaming/trial-activation/trial-streaming-customer-info-success.json` });
};

export const stubValidateCustomerInfoServiceAddressSuccess = () => {
    cy.intercept('POST', '**/services/validate/customer-info', {
        fixture: `de-microservices/checkout/streaming/trial-activation/trial-streaming-customer-info-service-address-success.json`,
    });
};

export const validateTrialPasswordSuccess = () => {
    cy.intercept('POST', '**/services/validate/password', { fixture: `de-microservices/checkout/streaming/trial-activation/trial-streaming-password-success.json` });
};

export const startMyTrialStreamingSuccess = () => {
    cy.intercept('POST', '**/services/check-eligibility/streaming', { fixture: `de-microservices/checkout/streaming/trial-activation/start-my-trial-streaming-success.json` });
};

export const startMyTrialUpdateUsecaseSuccess = () => {
    cy.intercept('POST', '**/services/apigateway/update-usecase', {
        fixture: `de-microservices/checkout/streaming/trial-activation/start-my-trial-update-usecase-success.json`,
    });
};

export const startMyTrialUtilityCardBinRangesSuccess = () => {
    cy.intercept('POST', '**/services/utility/card-bin-ranges', {
        fixture: `de-microservices/checkout/streaming/trial-activation/start-my-trial-utility-cardbin-ranges-success.json`,
    });
};

export const startMyTrialOffersSuccess = () => {
    cy.intercept('POST', '**/services/offers', { fixture: `de-microservices/checkout/streaming/trial-activation/start-my-trial-offers-success.json` });
};

export const startMyTrialRenewalOffersSuccess = () => {
    cy.intercept('POST', '**/services/offers/renewal', { fixture: `de-microservices/checkout/streaming/trial-activation/start-my-trial-renewal-offers-success.json` });
};

export const startMyTrialOffersInfoSuccess = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: `de-microservices/checkout/streaming/trial-activation/start-my-trial-offers-Info-success.json` });
};

export const rtdTrialActivationNewAccountSuccess = () => {
    cy.intercept('POST', '**/services/trial-activation/new-account', {
        fixture: `de-microservices/checkout/streaming/trial-activation/rtd-trial-activation-new-account-sucess.json`,
    });
};

export const rtdTrialActivationNonPiiSuccess = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: `de-microservices/checkout/streaming/trial-activation/rtd-trial-activation-non-pii-sucess.json` });
};
