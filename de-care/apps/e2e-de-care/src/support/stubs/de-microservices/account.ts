export const stubAccountAuthVerifyOptionsEmailRadioIdAccountNumberSuccess = () => {
    cy.intercept('POST', '**/services/account/auth-verify-options', { fixture: 'de-microservices/account/auth-verify-options/email-radio-id-account-number.json' });
};

export const stubAccountAuthVerifyOptionsPhoneEmailRadioIdAccountNumberSuccess = () => {
    cy.intercept('POST', '**/services/account/auth-verify-options', {
        fixture: 'de-microservices/account/auth-verify-options/phone-email-radio-id-account-number.json',
    });
};

export const stubAccountAuthVerifyOptionsRadioIdAccountNumberSuccess = () => {
    cy.intercept('POST', '**/services/account/auth-verify-options', { fixture: 'de-microservices/account/auth-verify-options/radio-id-account-number.json' });
};

export const stubAccountVerifySuccess = () => {
    cy.intercept('POST', '**/services/account/verify', { fixture: 'de-microservices/account/verify/success.json' });
};

export const stubAccountVerifyNewAccount = () => {
    cy.intercept('POST', '**/services/account/verify', { fixture: 'de-microservices/account/verify/new-account-success.json' });
};

export const stubAccountRegisterSuccess = () => {
    cy.intercept('POST', '**/services/account/register', { fixture: 'de-microservices/account/register/success.json' });
};

export const stubAccountWithSatelliteSubscriptionLoaded = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/with-satellite-subscription.json' });
};

export const stubAccountWithStreamingSubscriptionLoaded = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/with-streaming-subscription.json' });
};

export const stubAccountWithInfotainmentSubscriptionLoaded = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/with-infotainment-subscription.json' });
};

export const stubAccountWithTrialAndFollowOnSelfPay = () => {
    cy.intercept('POST', '**/services/account', { fixture: 'de-microservices/account/with-trial-and-follow-on-self-pay.json' });
};

export const stubAccountNonPiiSatelliteTargetedWithTrialAndActiveCc = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: `de-microservices/account/non-pii/satellite-targeted-with-trial-subscription-active-cc.json` });
};

export const stubAcountNonPiiTrialActivationServiceLaneTwoClick = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: `de-microservices/account/non-pii/trial-activation-sl2c-non-pii.json` });
};

export const stubAccountNonPiiOneStepTrialActivation = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: `de-microservices/account/non-pii/one-step-trial-activation-non-pii.json` });
};

export const stubAccountNonPiiServiceLaneOneClickTrialActivation = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: `de-microservices/account/non-pii/service-lane-one-click-confirmation-non-pii.json` });
};

export const stubAccountNonPiiTrialActivationOrganic = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: `de-microservices/account/non-pii/trial-activation-organic-non-pii.json` });
};

export const stubAccountStreamingNonAccordionTargetedFullPriceStreamingNotRegistered = () => {
    cy.intercept('POST', '**/services/account', {
        fixture: 'de-microservices/account/streaming-non-accordion-targeted_full-price-streaming-not-registered.json',
    });
};

export const stubAccountAcscOrganicSuccess = () => {
    cy.intercept('POST', '**/services/account/acsc', { fixture: 'de-microservices/account/acsc/organic_success.json' });
};

export const stubAccountCredentialRecoveryUsernameSendEmailSuccess = () => {
    cy.intercept('POST', '**/services/account/credential-recovery/username/send-email', {
        fixture: 'de-microservices/account/credential-recovery/username/send-email/success.json',
    });
};

export const stubAccountNextBestActionSuccessWithActions = () => {
    cy.intercept('GET', '**/services/account/next-best-action', { fixture: 'de-microservices/account/next-best-action/success-with-actions.json' });
};

export const stubAccountNextBestActionSuccessWithNoActions = () => {
    cy.intercept('GET', '**/services/account/next-best-action', { fixture: 'de-microservices/account/next-best-action/success-no-actions.json' });
};

export const stubAccountNonPiiSatelliteTargetedWithTrialSubscription = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: `de-microservices/account/non-pii/satellite-targeted_with-trial-subscription.json` });
};

export const stubAccountNonPiiZeroCostSatelliteOrganicSuccess = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: `de-microservices/account/non-pii/zero-cost-satellite-organic_success.json` });
};

export const stubAccountNonPiiStreamingAccordionOrganicSuccess = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: 'de-microservices/account/non-pii/streaming-accordion-organic_success.json' });
};

export const stubAccountNonPiiStreamingNonAccordionOrganicSuccess = () => {
    cy.intercept('POST', '**/non-pii', { fixture: 'de-microservices/account/non-pii/streaming-non-accordion-organic_success.json' });
};

export const stubAccountNonPiiStreamingNonAccordionOrganicUpsellTerm = () => {
    cy.intercept('POST', '**/non-pii', { fixture: 'de-microservices/account/non-pii/streaming-non-accordion-organic_upsell-term.json' });
};

export const stubAccountNonPiiSatelliteOrganicWithSelfPaySubscription = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: 'de-microservices/account/non-pii/satellite-organic_with-self-pay-subscription.json' });
};

export const stubAccountNonPiiStreamingNonAccordionOrganicTrialSubscriptionSuccess = () => {
    cy.intercept('POST', '**/services/account/non-pii', {
        fixture: 'de-microservices/account/non-pii/streaming-non-accordion-organic_trial-subscription-success.json',
    });
};

export const stubAccountNonPiiSatelliteTargetedClosedRadioWithNoNicknameOrYmm = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: `de-microservices/account/non-pii/satellite-targeted_closed-radio-with-no-nickname-or-ymm.json` }).as(
        'accountCall'
    );
};

export const stubAccountNonPiiSatelliteTargetedClosedRadioWithDuplicateYmm = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: `de-microservices/account/non-pii/satellite-targeted_closed-radio-with-duplicate-ymm.json` }).as(
        'accountCall'
    );
};

export const stubAccountNonPiiSatelliteTargetedClosedRadioWithYmm = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: `de-microservices/account/non-pii/satellite-targeted_closed-radio-with-ymm.json` }).as('accountCall');
};

export const stubAccountNonPiiSatelliteTargetedClosedRadioWithNickname = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: `de-microservices/account/non-pii/satellite-targeted_closed-radio-with-nickname.json` }).as('accountCall');
};

export const stubAccountNonPiiSatelliteOrganicWithTrialSubscription = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: 'de-microservices/account/non-pii/satellite-organic_with-trial-subscription.json' });
};

export const stubAccountNonPiiSatelliteOrganicNewAccountCreated = () => {
    cy.intercept('POST', '**/services/account/non-pii', { fixture: 'de-microservices/account/non-pii/satellite-organic_new-account-created.json' });
};

export const stubAccountNonPiiSatelliteOrganic400DeviceNotInUse = () => {
    cy.intercept('POST', '**/services/account/non-pii', { statusCode: 400, fixture: 'de-microservices/account/non-pii/satellite-organic_400-device-not-in-use.json' });
};

export const stubAccountNonPiiStreamingSubscriptionClosedRadio = () => {
    cy.intercept('POST', '**/services/account/non-pii', {
        fixture: 'de-microservices/account/non-pii/streaming-subscription-and-closed-device.json',
    });
};

export const stubAccountNonPiiSatelliteOrganicAccountWithClosedRadio = () => {
    cy.intercept('POST', '**/account/non-pii', {
        fixture: 'de-microservices/account/non-pii/satellite-organic_account-with-closed-radio.json',
    });
};

export const stubAccountNonPiiNoAccountWithMarketingId = () => {
    cy.intercept('POST', '**/account/non-pii', {
        fixture: 'de-microservices/account/non-pii/satellite-organic_no-account-with-marketing-id.json',
    });
};

export const stubAccountNonPiiSatelliteAccordionOrganicTrialWithSiriusPlatform = () => {
    cy.intercept('POST', '**/account/non-pii', { fixture: 'de-microservices/account/non-pii/satellite-accordion-organic_trial-with-sirius-platform.json' });
};

export const stubAccountNonPiiSatelliteAccordionOrganicWithTrialAndNoCardOnFile = () => {
    cy.intercept('POST', '**/account/non-pii', { fixture: 'de-microservices/account/non-pii/satellite-accordion-organic_with-trial-and-no-card-on-file.json' });
};

export const stubAccountRegistrationAccountProfileEmailNotEligibleForUsername = () => {
    cy.intercept('POST', '**/services/account/registration/account-profile', {
        fixture: 'de-microservices/account/registration/account-profile/email-not-eligible-for-username.json',
    });
};

export const stubAccountRegistrationNonPiiSuccess = () => {
    cy.intercept('POST', '**/services/account/registration/non-pii', { fixture: 'de-microservices/account/registration/non-pii/success.json' });
};

export const stubAccountRegistrationNonPiiSuccessNoData = () => {
    cy.intercept('POST', '**/services/account/registration/non-pii', { fixture: 'de-microservices/account/registration/non-pii/success-no-data.json' });
};

export const stubAccountTokenStreamingNonAccordionTargetedSingleDigitalRtpTrialNoFollowOnSubscription = () => {
    cy.intercept('POST', '**/services/account/token', {
        fixture: 'de-microservices/account/token/streaming-non-accordion-targeted_single-digital-rtp-trial-no-follow-on-subscription.json',
    });
};

export const stubAccountTokenStreamingNonAccordionTargetedSingleDigitalSelfPaySubscription = () => {
    cy.intercept('POST', '**/services/account/token', {
        fixture: 'de-microservices/account/token/streaming-non-accordion-targeted_single-digital-self-pay-subscription.json',
    });
};

export const stubAccountTokenStreamingNonAccordionTargetedSingleDigitalRtdTrialSubscription = () => {
    cy.intercept('POST', '**/services/account/token', {
        fixture: 'de-microservices/account/token/streaming-non-accordion-targeted_single-digital-rtd-trial-subscription.json',
    });
};

export const stubAccountTokenStreamingNonAccordionTargetedSingleDigitalRtpTrialSubscription = () => {
    cy.intercept('POST', '**/services/account/token', {
        fixture: 'de-microservices/account/token/streaming-non-accordion-targeted_single-digital-rtp-trial-subscription.json',
    });
};

export const stubAccountTokenStreamingNonAccordionTargetedNoSubscriptionsAndNotRegistered = () => {
    cy.intercept('POST', '**/services/account/token', {
        fixture: 'de-microservices/account/token/streaming-non-accordion-targeted_no-subscriptions-and-not-registered.json',
    });
};

export const stubAccountTokenWithCardOnFile = () => {
    cy.intercept('POST', '**/services/account/token', { fixture: 'de-microservices/account/token/streaming-common_with-card-on-file.json' });
};

export const stubAccountChangeSubscriptionTargetedExistingSatelliteSubscription = () => {
    cy.intercept('POST', '**/services/account/token', {
        fixture: 'de-microservices/account/token/change-subscription-targeted_existing-satellite-subscription.json',
    });
};

export const stubAccountTokenClosedDeviceCardOnFile = () => {
    cy.intercept('POST', '**/services/account/token', { fixture: 'de-microservices/account/token/satellite-targeted_closed-device-card-on-file.json' });
};

export const stubAccountUpgradeVipSatelliteCommonWithOneNonVipPlan = () => {
    cy.intercept('POST', '**/services/account/upgrade-vip', { fixture: 'de-microservices/account/upgrade-vip/satellite-common_with-one-non-vip-plan.json' });
};

export const stubAccountCredentialRecoveryPasswordSendEmailSuccess = () => {
    cy.intercept('POST', '**/services/account/credential-recovery/password/send-email', {
        fixture: 'de-microservices/account/credential-recovery/password/send-email/success.json',
    });
};

export const stubAccountCredentialRecoveryPasswordSendTextSuccess = () => {
    cy.intercept('POST', '**/services/account/credential-recovery/password/send-text', {
        fixture: 'de-microservices/account/credential-recovery/password/send-text/success.json',
    });
};

export const stubAccountCredentialRecoveryUpdatePasswordSuccess = () => {
    cy.intercept('POST', '**/services/account/credential-recovery/update-password', { fixture: 'de-microservices/account/credential-recovery/update-password/success.json' });
};

export const stubAccountCredentialRecoveryValidateKeySuccess = () => {
    cy.intercept('POST', '**/services/account/credential-recovery/validate-key', { fixture: 'de-microservices/account/credential-recovery/validate-key/success.json' });
};

export const stubAccountCustomerInfoSuccess = () => {
    cy.intercept('POST', '**/services/account/customer-info', { fixture: 'de-microservices/account/customer-info/success.json' });
};

export const stubAccountCustomerInfoOneStepTrialActivation = () => {
    cy.intercept('GET', '**/services/account/customer-info', { fixture: 'de-microservices/account/customer-info/one-step-trial-activation-customer-info.json' });
};

export const stubAccountOemSuccess = () => {
    cy.intercept('POST', '**/services/account/oem', { fixture: 'de-microservices/account/oem/success.json' });
};

export const stubAccountProspectCreateStreamingPasswordSuccess = () => {
    cy.intercept('POST', '**/services/account/prospect/create-streaming-password', { fixture: 'de-microservices/account/prospect/create-streaming-password/success.json' });
};

export const stubAccountProspectCreateStreamingTrialSuccess = () => {
    cy.intercept('POST', '**/services/account/prospect/create-streaming-trial', { fixture: 'de-microservices/account/prospect/create-streaming-trial/success.json' });
};

export const stubAccountTokenStreamingProspectCnaTokenSuccess = () => {
    cy.intercept('POST', '**/services/account/token/streaming', { fixture: 'de-microservices/account/token/streaming/prospect-cna-success.json' });
};

export const stubAccountTokenStreamingStreamingWinbackSuccess = () => {
    cy.intercept('POST', '**/services/account/token/streaming', { fixture: 'de-microservices/account/token/streaming/streaming-winback-success.json' });
};

export const stubAccountTokenStreamingProspectUsernameSuccess = () => {
    cy.intercept('POST', '**/services/account/token/streaming', { fixture: 'de-microservices/account/token/streaming/prospect-username-success.json' });
};

export const stubAccountTokenUsernameSuccess = () => {
    cy.intercept('POST', '**/services/account/token/username', { fixture: 'de-microservices/account/token/username/success.json' });
};

export const stubAccountUpdateStreamingSuccess = () => {
    cy.intercept('POST', '**/services/account/update-streaming', { fixture: 'de-microservices/account/update-streaming/success.json' });
};
