export const stubOffersSuccessDigitalRtpFree = () => {
    stubOffersDigitalRtpFreeOffersSuccess();
    stubOffersRenewalDigitalRtpFreeRenewalsSuccess();
    stubOffersInfoDigitalRtpFreeOffersInfoSuccessAsOffersInfo();
};

export const stubOffersDigitalRtpFreeOffersSuccess = () => {
    cy.intercept('POST', '**/services/offers', { fixture: 'de-microservices/offers/digital-rtp-free-offers-success.json' });
};

export const stubOffersRenewalDigitalRtpFreeRenewalsSuccess = () => {
    cy.intercept('POST', '**/services/offers/renewal', { fixture: 'de-microservices/offers/renewal/digital-rtp-free-renewals-success.json' });
};

export const stubOffersInfoDigitalRtpFreeOffersInfoSuccessAsOffersInfo = () => {
    cy.intercept({ method: 'POST', url: '**/services/offers/info', times: 1 }, { fixture: 'de-microservices/offers/info/digital-rtp-free-offers-info-success.json' }).as(
        'offersInfo'
    );
};

export const stubOffersCustomerSuccessDigitalRtpFree = () => {
    stubOffersCustomerDigitalRtpFreeOffersCustomerSuccess();
    stubOffersRenewalDigitalRtpFreeRenewalsSuccess();
    stubOffersInfoDigitalRtpFreeOffersInfoSuccess();
};

export const stubOffersCustomerDigitalRtpFreeOffersCustomerSuccess = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: 'de-microservices/offers/customer/digital-rtp-free-offers-customer-success.json' });
};

export const stubOffersInfoDigitalRtpFreeOffersInfoSuccess = () => {
    cy.intercept({ method: 'POST', url: '**/services/offers/info', times: 1 }, { fixture: 'de-microservices/offers/info/digital-rtp-free-offers-info-success.json' });
};

export const stubOffersSuccessDigitalPromo = () => {
    stubOffersDigitalPromoSelfPayOffersSuccess();
    stubOffersRenewalDigitalPromoSelfPayRenewalsSuccess();
    stubOffersInfoDigitalPromoSelfPayOffersInfoSuccess();
};

export const stubOffersDigitalPromoSelfPayOffersSuccess = () => {
    cy.intercept('POST', '**/services/offers', { fixture: 'de-microservices/offers/digital-promo-self-pay-offers-success.json' });
};

export const stubOffersRenewalDigitalPromoSelfPayRenewalsSuccess = () => {
    cy.intercept('POST', '**/services/offers/renewal', { fixture: 'de-microservices/offers/renewal/digital-promo-self-pay-renewals-success.json' });
};

export const stubOffersInfoDigitalPromoSelfPayOffersInfoSuccess = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/digital-promo-self-pay-offers-info-success.json' });
};

export const stubOffersCustomerSuccessDigitalPromo = () => {
    stubOffersCustomerDigitalPromoSelfPayOffersCustomerSuccess();
    stubOffersUpsellDigitalPromoSelfPayOffersUpsellSuccess();
    stubOffersRenewalDigitalPromoSelfPayRenewalsSuccess();
    stubOffersInfoDigitalPromoSelfPayOffersInfoSuccess();
};

export const stubOffersCustomerDigitalPromoSelfPayOffersCustomerSuccess = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: 'de-microservices/offers/customer/digital-promo-self-pay-offers-customer-success.json' });
};

export const stubOffersUpsellDigitalPromoSelfPayOffersUpsellSuccess = () => {
    cy.intercept('POST', '**/services/offers/upsell', { fixture: 'de-microservices/offers/upsell/digital-promo-self-pay-offers-upsell-success.json' });
};

export const stubOffersSuccessDigitalPromoFallback = () => {
    stubOffersDigitalPromoSelfPayOffersFallbackSuccess();
    stubOffersRenewalDigitalPromoSelfPayRenewalsSuccess();
    stubOffersInfoDigitalPromoSelfPayOffersInfoFallbackSuccess();
};

export const stubOffersDigitalPromoSelfPayOffersFallbackSuccess = () => {
    cy.intercept('POST', '**/services/offers', { fixture: 'de-microservices/offers/digital-promo-self-pay-offers-fallback-success.json' });
};

export const stubOffersInfoDigitalPromoSelfPayOffersInfoFallbackSuccess = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/digital-promo-self-pay-offers-info-fallback-success' });
};

export const stubOffersSuccessDigitalPromoFallbackExpired = () => {
    stubOffersDigitalPromoSelfPayOffersFallbackExpiredSuccess();
    stubOffersRenewalDigitalPromoSelfPayRenewalsSuccess();
    stubOffersInfoDigitalPromoSelfPayOffersInfoFallbackExpiredSuccess();
};

export const stubOffersDigitalPromoSelfPayOffersFallbackExpiredSuccess = () => {
    cy.intercept('POST', '**/services/offers', { fixture: 'de-microservices/offers/digital-promo-self-pay-offers-fallback-expired-success.json' });
};

export const stubOffersInfoDigitalPromoSelfPayOffersInfoFallbackExpiredSuccess = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/digital-promo-self-pay-offers-info-fallback-expired-success.json' });
};

export const stubOffersSuccessDigitalPromoFallbackReasonOthers = () => {
    stubOffersDigitalPromoSelfPayOffersFallbackReasonOthersSuccess();
    stubOffersRenewalDigitalPromoSelfPayRenewalsSuccess();
    stubOffersInfoDigitalPromoSelfPayOffersInfoFallbackReasonOthersSuccess();
};

export const stubOffersDigitalPromoSelfPayOffersFallbackReasonOthersSuccess = () => {
    cy.intercept('POST', '**/services/offers', { fixture: 'de-microservices/offers/digital-promo-self-pay-offers-fallback-reason-others-sucess.json' });
};

export const stubOffersInfoDigitalPromoSelfPayOffersInfoFallbackReasonOthersSuccess = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/digital-promo-self-pay-offers-info-fallback-reason-others-sucess.json' });
};

export const stubOffersSuccessSatelliteOrganicDefaultOfferSelfPay = () => {
    stubOffersSatelliteDefaultSelfPayOffersSuccess();
    stubOffersRenewalSatelliteDefaultSelfPayRenewalsSuccess();
    stubOffersInfoSatelliteDefaultSelfPayOffersInfoSuccess();
};

export const stubOffersSatelliteDefaultSelfPayOffersSuccess = () => {
    cy.intercept('POST', '**/services/offers', { fixture: 'de-microservices/offers/satellite-default-self-pay-offers-success.json' });
};

export const stubOffersRenewalSatelliteDefaultSelfPayRenewalsSuccess = () => {
    cy.intercept('POST', '**/services/offers/renewal', { fixture: 'de-microservices/offers/renewal/satellite-default-self-pay-renewals-success.json' });
};

export const stubOffersInfoSatelliteDefaultSelfPayOffersInfoSuccess = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/satellite-default-self-pay-offers-info-success.json' }).as('offersInfoCall');
};

export const stubOffersInfoSatelliteOrganicDefaultSpecialUpgradeInfoSuccess = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/satellite-default-self-pay-special-offer-info-success.json' });
};

export const stubOffersSuccessSatellitePromoSelfPay = () => {
    stubOffersSatellitePromoSelfPayOffersSuccess();
    stubOffersRenewalSatellitePromoSelfPayRenewalsSuccess();
    stubOffersInfoSatellitePromoSelfPayOffersInfoSuccess();
};

export const stubOffersSatellitePromoSelfPayOffersSuccess = () => {
    cy.intercept('POST', '**/services/offers', { fixture: 'de-microservices/offers/satellite-promo-self-pay-offers-success.json' });
};

export const stubOffersRenewalSatellitePromoSelfPayRenewalsSuccess = () => {
    cy.intercept('POST', '**/services/offers/renewal', { fixture: 'de-microservices/offers/renewal/satellite-promo-self-pay-renewals-success.json' });
};

export const stubOffersInfoSatellitePromoSelfPayOffersInfoSuccess = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/satellite-promo-self-pay-offers-info-success.json' });
};

export const stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell = () => {
    stubOffersCustomerSatellitePromoSelfPayOffersCustomerSuccess();
    stubOffersRenewalSatellitePromoSelfPayRenewalsSuccess();
    stubOffersUpsellSatellitePromoSelfPayOffersUpsellSuccess();
    stubOffersInfoSatellitePromoSelfPayOffersInfoSuccess();
    stubOffersUpsellInfoSatellitePromoSelfPayOffersUpsellInfoSuccess();
};

export const stubOffersCustomerSatellitePromoSelfPayOffersCustomerTermOnlySuccess = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: 'de-microservices/offers/customer/satellite-organic-self-pay-offers-customer-success-term-only.json' });
};

export const stubOffersUpsellSatellitePromoSelfPayOffersUpsellTermOnlySuccess = () => {
    cy.intercept('POST', '**/services/offers/upsell', { fixture: 'de-microservices/offers/upsell/satellite-organic-self-pay-offers-upsell-only-success.json' });
};

export const stubOffersInfoSatellitePromoSelfPayOffersTermOnlySuccess = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/satellite-organic-offers-info-self-pay-term-only-success.json' });
};

export const stubOffersUpsellInfoSatellitePromoSelfPayUpsellInfoTermOnlySuccess = () => {
    cy.intercept('POST', '**/services/offers/upsell/info', {
        fixture: 'de-microservices/offers/upsell/info/satellite-organic-offers-upsell-info-self-pay-term-only-success.json',
    });
};

export const stubOffersCustomerSuccessSatellitePromoSelfPayWithTermUpsellOnly = () => {
    stubOffersCustomerSatellitePromoSelfPayOffersCustomerTermOnlySuccess();
    stubOffersRenewalSatellitePromoSelfPayRenewalsSuccess();
    stubOffersUpsellSatellitePromoSelfPayOffersUpsellTermOnlySuccess();
    stubOffersInfoSatellitePromoSelfPayOffersTermOnlySuccess();
    stubOffersUpsellInfoSatellitePromoSelfPayUpsellInfoTermOnlySuccess();
};

export const stubOffersCustomerSatelliteOrganicDefaultSelfPayOffersCustomerSuccess = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: 'de-microservices/offers/customer/satellite-default-self-pay-offers-customer-success.json' });
};

export const stubOffersCustomerSatellitePromoSelfPayOffersCustomerSuccess = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: 'de-microservices/offers/customer/satellite-promo-self-pay-offers-customer-success.json' });
};

export const stubOffersUpsellSatellitePromoSelfPayOffersUpsellSuccess = () => {
    cy.intercept('POST', '**/services/offers/upsell', { fixture: 'de-microservices/offers/upsell/satellite-promo-self-pay-offers-upsell-success.json' });
};

export const stubOffersUpsellInfoSatellitePromoSelfPayOffersUpsellInfoSuccess = () => {
    cy.intercept('POST', '**/services/offers/upsell/info', { fixture: 'de-microservices/offers/upsell/satellite-promo-self-pay-offers-upsell-info-success.json' });
};

export const stubOffersSuccessSatelliteRtpFree = () => {
    stubOffersSatelliteRtpFreeOffersSuccess();
    stubOffersInfoSatelliteRtpFreeOffersInfoSuccess();
};

export const stubOffersSatelliteRtpFreeOffersSuccess = () => {
    cy.intercept('POST', '**/services/offers', { fixture: 'de-microservices/offers/satellite-rtp-free-offers-success.json' });
};

export const stubOffersInfoSatelliteRtpFreeOffersInfoSuccess = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/satellite-rtp-free-offers-info-success.json' });
};

export const stubOffersSuccessSatellitePlatinumVIP = () => {
    stubOffersPlatinumVipOffersSuccess();
    stubOffersInfoPlatinumVipOffersInfoSuccess();
};

export const stubOffersPlatinumVipOffersSuccess = () => {
    cy.intercept('POST', '**/services/offers', { fixture: 'de-microservices/offers/platinum-vip-offers-success.json' });
};

export const stubOffersInfoPlatinumVipOffersInfoSuccess = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/platinum-vip-offers-info-success.json' });
};

export const stubOffersCustomerSuccessSatellitePlatinumVIP = () => {
    stubOffersCustomerPlatinumVipOffersCustomerSuccess();
    stubOffersInfoPlatinumVipOffersInfoSuccess();
};

export const stubOffersCustomerPlatinumVipOffersCustomerSuccess = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: 'de-microservices/offers/customer/platinum-vip-offers-customer-success.json' });
};

export const stubOffersSuccessDigitalPlatinumWithEchoDotDeal = () => {
    stubOffersDigitalSelfPayOffersWithAmazonDotDealSuccess();
    stubOffersInfoDigitalSelfPayOffersWithAmazonDotDealInfoSuccess();
};

export const stubOffersDigitalSelfPayOffersWithAmazonDotDealSuccess = () => {
    cy.intercept('POST', '**/services/offers', { fixture: 'de-microservices/offers/digital-self-pay-offers-with-amazon-dot-deal-success.json' });
};

export const stubOffersInfoDigitalSelfPayOffersWithAmazonDotDealInfoSuccess = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/digital-self-pay-offers-with-amazon-dot-deal-info-success.json' });
};

export const stubOffersSuccessDigitalEssentialStreamingMonthly = () => {
    stubOffersDigitalSelfPayOffersEssentialStreamingMonthlySuccess();
    stubOffersInfoDigitalSelfPayOffersEssentialStreamingMonthlyInfoSuccessAsOffersInfo();
};

export const stubOffersDigitalSelfPayOffersEssentialStreamingMonthlySuccess = () => {
    cy.intercept('POST', '**/services/offers', { fixture: 'de-microservices/offers/digital-self-pay-offers-essential-streaming-monthly-success.json' });
};

export const stubOffersInfoDigitalSelfPayOffersEssentialStreamingMonthlyInfoSuccessAsOffersInfo = () => {
    cy.intercept(
        { method: 'POST', url: '**/services/offers/info' },
        { fixture: 'de-microservices/offers/info/digital-self-pay-offers-essential-streaming-monthly-info-success.json' }
    ).as('offersInfo');
};

export const stubAllPackageDescriptionsSuccess = () => {
    cy.intercept('POST', '**/services/offers/all-package-desc', { fixture: 'de-microservices/offers/all-package-desc/success.json' });
};

export const stubCheckEligibilityCaptchaRequiredSuccess = () => {
    cy.intercept('POST', '**/services/check-eligibility/captcha', { fixture: 'de-microservices/offers/check-eligibility/captcha/required-success.json' });
};

export const stubCheckEligibilityCaptchaNotRequiredSuccess = () => {
    cy.intercept('POST', '**/services/check-eligibility/captcha', { fixture: 'de-microservices/offers/check-eligibility/captcha/not-required-success.json' });
};

export const stubOffersNoPromoSuccess = () => {
    cy.intercept('POST', '**/services/offers', { fixture: 'de-microservices/offers/no-promo-success.json' });
};

export const stubOffersTrialActivationOrganicAA3MOTRIALGGLE = () => {
    cy.intercept('POST', '**/services/offers', { fixture: 'de-microservices/offers/program_AA3MOTRIALGGLE.success.json' });
};

export const stubOffersServiceLane2ClickSuccess = () => {
    cy.intercept('POST', '**/services/offers', { fixture: 'de-microservices/offers/service-lane-2-click.json' });
};

export const stubValidatePromoCodeSuccess = () => {
    cy.intercept('POST', '**/services/offers/promocode/validate', { fixture: 'de-microservices/offers/promocode/validate/success.json' });
};

export const stubValidatePromoCodeInvalid = () => {
    cy.intercept('POST', '**/services/offers/promocode/validate', { fixture: 'de-microservices/offers/promocode/validate/invalid.json', statusCode: 400 });
};

export const stubValidatePromoCodeRedeemed = () => {
    cy.intercept('POST', '**/services/offers/promocode/validate', { fixture: 'de-microservices/offers/promocode/validate/redeemed.json', statusCode: 400 });
};

export const stubValidatePromoCodeExpired = () => {
    cy.intercept('POST', '**/services/offers/promocode/validate', { fixture: 'de-microservices/offers/promocode/validate/expired.json', statusCode: 400 });
};

export const stubOffersCheckEligibilityStreamingCommonSuccess = () => {
    cy.intercept('POST', '**/services/check-eligibility/streaming', { fixture: 'de-microservices/offers/check-eligibility/streaming/streaming-common_success.json' });
};

export const stubOffersCheckEligibilityStudentSuccess = () => {
    cy.intercept('POST', '**/services/check-eligibility/student', { fixture: 'de-microservices/offers/check-eligibility/student/success.json' });
};

export const stubOffersCustomerAcscSuccess = () => {
    cy.intercept('POST', '**/services/offers/customer/acsc', { fixture: 'de-microservices/offers/customer/acsc/success.json' });
};

export const stubOffersFollowonSuccess = () => {
    cy.intercept('POST', '**/services/offers/followon', { fixture: 'de-microservices/offers/followon/success.json' });
};

export const stubOffersCustomerUpgradeSuccess = () => {
    cy.intercept('POST', '**/services/offers/customer/upgrade', { fixture: 'de-microservices/offers/customer/upgrade/success.json' });
};

export const stubOffersFreeListenPromoSuccess = () => {
    cy.intercept('POST', '**/services/offers/free-listen-promo', { fixture: 'de-microservices/offers/free-listen-promo/success.json' });
};

export const stubOffersCustomerSatelliteTargetedSelfPayPromoOffer = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: `de-microservices/offers/customer/satellite-targeted_self-pay-promo-offer.json` }).as('offersCall');
};

export const stubOffersCustomerTrialActivationOrganic = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: `de-microservices/offers/customer/trial-activation-organic-offers-customer.json` });
};

export const stubOffersCustomerSatelliteOrganicWithSiriusAllAccessSuccess = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: 'de-microservices/offers/customer/satellite-organic_with-sirius-all-access-success.json' });
};

export const stubOffersCustomerSatelliteOrganicWithSiriusPlatformChange = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: 'de-microservices/offers/customer/satellite-organic_with-sirius-change-platform.json' });
};

export const stubOffersRenewalSatelliteTargetedNoOffers = () => {
    cy.intercept('POST', '**/services/offers/renewal', { fixture: `de-microservices/offers/renewal/satellite-targeted_no-offers.json` });
};

export const stubOffersInfoChangeSubscriptionTargetedMultiple = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: `de-microservices/offers/info/change-subscription-targeted_multiple.json` }).as('offersInfoCall');
};

export const stubOffersInfoSatelliteTargetedMcp5for12Offer = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: `de-microservices/offers/info/satellite-targeted_mcp-5for12-offer.json` });
};

export const stubOffersInfoSatelliteTargetedRollToChoiceAsOffersInfoCall = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: `de-microservices/offers/info/satellite-targeted_roll-to-choice.json` }).as('offersInfoCall');
};

export const stubOffersInfoSatelliteTargetedSelfPayPromoOfferAsOffersInfoCall = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: `de-microservices/offers/info/satellite-targeted_self-pay-promo-offer.json` }).as('offersInfoCall');
};

export const stubOffersInfoSatelliteAccordionOrganicSiriusMusicAndEntertainment = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/satellite-accordion-organic_sirius-music-and-entertainment.json' });
};

export const stubOffersInfoTrialActivationOrganicAA3MOTRIALGGLE = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/program_AA3MOTRIALGGLE.json' });
};

export const stubOffersInfoStreamingCommonFallback = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/streaming-common_fallback.json' });
};

export const stubOffersInfoStreamingCommonForUpsellTermAsOffersInfoForUpsell = () => {
    cy.intercept({ method: 'POST', url: '**/services/offers/info', times: 1 }, { fixture: 'de-microservices/offers/info/streaming-common_for-upsell-term.json' }).as(
        'offersInfoForUpsell'
    );
};

export const stubOffersInfoStreamingNonAccordionTargetedMultiRadioDiscount = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/streaming-non-accordion-targeted_multi-radio-discount.json' });
};

export const stubOffersInfoStreamingNonAccordionTargetedAddStreamingMrd = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/streaming-non-accordion-targeted_add-streaming-mrd.json' });
};

export const stubOffersInfoStreamingNonAccordionTargetedEssentialStreamingMonthly = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/streaming-non-accordion-targeted_essential-streaming-monthly.json' });
};

export const stubOffersInfoStreamingNonAccordionTargetedStreamingPlatinumWithEchoDotDeal = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/streaming-non-accordion-targeted_streaming-platinum-with-echo-dot-deal.json' });
};

export const stubOffersInfoZeroCostSatelliteOrganicSuccess = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: `de-microservices/offers/info/zero-cost-satellite-organic_success.json` });
};

export const stubOffersInfoChangeSubscriptionOrganicMultiple = () => {
    cy.intercept('POST', '**/services/offers/info', { fixture: 'de-microservices/offers/info/change-subscription-organic_multiple.json' });
};

export const stubOffersCustomerSatelliteTargetedRollToChoice = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: `de-microservices/offers/customer/satellite-targeted_roll-to-choice.json` }).as('offersCall');
};

export const stubOffersUpsellSatelliteTargetedSelfPayPromoPackageAndTerm = () => {
    cy.intercept('POST', '**/services/offers/upsell', { fixture: `de-microservices/offers/upsell/satellite-targeted_self-pay-promo-package-and-term.json` }).as('upsellCall');
};

export const stubOffersUpsellInfSatelliteTargetedSelfPayPromoPackageAndTerm = () => {
    cy.intercept('POST', '**/services/offers/upsell/info', { fixture: `de-microservices/offers/upsell/info/satellite-targeted_self-pay-promo-package-and-term.json` });
};

export const stubOffersUpsellSatelliteTargetedSelfPayPromoPackageAndTermAsUpsellCall = () => {
    cy.intercept('POST', '**/services/offers/upsell', { fixture: `de-microservices/offers/upsell/satellite-targeted_self-pay-promo-package-and-term.json` }).as('upsellCall');
};

export const stubOffersUpsellInfoSatelliteTargetedSelfPayPromoPackageAndTerm = () => {
    cy.intercept('POST', '**/services/offers/upsell/info', { fixture: `de-microservices/offers/upsell/info/satellite-targeted_self-pay-promo-package-and-term.json` });
};

export const stubOffersUpsellStreamingCommonTermOnlyAsGetUpsells = () => {
    cy.intercept('POST', '**/services/offers/upsell', { fixture: 'de-microservices/offers/upsell/streaming-common_term-only.json' }).as('getUpsells');
};

export const stubOffersUpsellInfoStreamingCommonTermOnly = () => {
    cy.intercept('POST', '**/services/offers/upsell/info', { fixture: 'de-microservices/offers/upsell/info/streaming-common_term-only.json' });
};

export const stubOffersRenewalSatelliteTargetedRollToChoice = () => {
    cy.intercept('POST', '**/services/offers/renewal', { fixture: `de-microservices/offers/renewal/satellite-targeted_roll-to-choice.json` });
};

export const stubOffersCustomerChangeTargetedMultiple = () => {
    cy.intercept('POST', '**/services/offers/customer/change', { fixture: 'de-microservices/offers/customer/change/targeted_multiple.json' });
};

export const stubOffersCustomerSatelliteTargetedMcp5for12Offer = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: `de-microservices/offers/customer/satellite-targeted_mcp-5for12-offer.json` });
};

export const stubOffersCustomerStreamingCommonFallback = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: 'de-microservices/offers/customer/streaming-common_fallback.json' });
};

export const stubOffersCustomerOneStepTrialActivation = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: 'de-microservices/offers/customer/one-step-trial-activation-offers.json' });
};

export const stubOffersCustomerStreamingNonAccordionOrganicEssentialStreamingMonthly = () => {
    cy.intercept('POST', '**/services/offers/customer', {
        fixture: 'de-microservices/offers/customer/streaming-non-accordion-organic_essential-streaming-monthly.json',
    });
};

export const stubOffersCustomerAddStreamingNonAccordionTargetedMultiRadioDiscount = () => {
    cy.intercept('POST', '**/services/offers/customer/add', { fixture: 'de-microservices/offers/customer/add/streaming-non-accordion-targeted_multi-radio-discount.json' });
};

export const stubOffersCustomerAddStreamingNonAccordionTargetedStreamingMrd = () => {
    cy.intercept('POST', '**/services/offers/customer/add', { fixture: 'de-microservices/offers/customer/add/streaming-non-accordion-targeted_streaming-mrd.json' });
};

export const stubOffersCustomerStreamingNonAccordionTargetedEssentialStreamingMonthly = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: 'de-microservices/offers/customer/streaming-non-accordion-targeted_essential-streaming-monthly.json' });
};

export const stubOffersCustomerStreamingNonAccordionTargetedIneligible = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: 'de-microservices/offers/customer/streaming-non-accordion-targeted_ineligible.json', statusCode: 412 });
};

export const stubOffersCustomerStreamingNonAccordionTargetedPlatinumWithEchoDotDeal = () => {
    cy.intercept('POST', '**/services/offers/customer', {
        fixture: 'de-microservices/offers/customer/streaming-non-accordion-targeted_platinum-with-echo-dot-deal.json',
    });
};

export const stubOffersCustomerZeroCostSatelliteOrganicSuccess = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: `de-microservices/offers/customer/zero-cost-satellite-organic_success.json` });
};

export const stubOffersCustomerCancelSatellite = () => {
    cy.intercept('POST', '**/services/offers/customer/cancel', { fixture: 'de-microservices/offers/customer/cancel/satellite.json' });
};
export const stubOffersCustomerCancelSatelliteNewExperience = () => {
    cy.intercept('POST', '**/services/offers/customer/cancel', { fixture: 'de-microservices/offers/customer/cancel/cancel-satellite-new-offer-experience.json' });
};
export const stubOffersCustomerCancelStreamingWithPlatinum = () => {
    cy.intercept('POST', '**/services/offers/customer/cancel', { fixture: 'de-microservices/offers/customer/cancel/streaming-with-platinum.json' });
};
export const stubOffersCustomerCancelStreamingWithMusicShowcase = () => {
    cy.intercept('POST', '**/services/offers/customer/cancel', {
        fixture: 'de-microservices/offers/customer/cancel/streaming-with-music-showcase.json',
    });
};
export const stubOffersCustomerCancelEmptyOffers = () => {
    cy.intercept('POST', '**/services/offers/customer/cancel', {
        fixture: 'de-microservices/offers/customer/cancel/empty.json',
    });
};
export const stubOffersCustomerCancelNoSpecialOffers = () => {
    cy.intercept('POST', '**/services/offers/customer/cancel', {
        fixture: 'de-microservices/offers/customer/cancel/no-special-offers.json',
    });
};

export const stubOffersCustomerChangeOrganicMultiple = () => {
    cy.intercept('POST', '**/services/offers/customer/change', {
        fixture: 'de-microservices/offers/customer/change/organic_multiple.json',
    });
};

export const stubOffersCheckEligibilityStreamingStreamingCommonSuccess = () => {
    cy.intercept('POST', '**/services/check-eligibility/streaming', { fixture: 'de-microservices/offers/check-eligibility/streaming/streaming-common_success.json' });
};

export const stubOffersCheckEligibilityStreamingStreamingCommonNotEligibleSuccess = () => {
    cy.intercept('POST', '**/services/check-eligibility/streaming', {
        fixture: 'de-microservices/offers/check-eligibility/streaming/streaming-common_not-eligible-success.json',
    });
};

export const stubOffersStreamingNonAccordionOrganicPlatinumWithEchoDotDeal = () => {
    cy.intercept('POST', '**/services/offers', {
        fixture: 'de-microservices/offers/streaming-non-accordion-organic_platinum-with-echo-dot-deal.json',
    });
};

export const stubOffersImagesAmzDotGen4TransparentBg = () => {
    cy.intercept('GET', 'http://cms-author.corp.siriusxm.com/content/dam/sxm-com/devices/amazon/amz-dot-gen4-transparent-bg.png', {
        fixture: `de-microservices/offers/images/amz-dot-gen4-transparent-bg.png`,
    });
};

export const stubOffersSatelliteAccordionOrganicFallbackNoCodeSuccess = () => {
    cy.intercept('POST', '**/services/offers', {
        fixture: 'de-microservices/offers/satellite-accordion-organic_fallback-no-code-success.json',
    });
};

export const stubOffersRenewalSatelliteAccordionOrganicFallbackNoCodeSuccess = () => {
    cy.intercept('POST', '**/services/offers/renewal', {
        fixture: 'de-microservices/offers/renewal/satellite-accordion-organic_fallback-no-code-success.json',
    });
};

export const stubOffersInfoSatelliteAccordionOrganicFallbackNoCodeSuccess = () => {
    cy.intercept('POST', '**/services/offers/info', {
        fixture: 'de-microservices/offers/info/satellite-accordion-organic_fallback-no-code-success.json',
    });
};

export const stubOffersSuccessSatelliteOrganicFallback = () => {
    stubOffersSatelliteAccordionOrganicFallbackNoCodeSuccess();
    stubOffersRenewalSatelliteAccordionOrganicFallbackNoCodeSuccess();
    stubOffersInfoSatelliteAccordionOrganicFallbackNoCodeSuccess();
};

export const stubOffersSuccessStreamingOrganicTrialRtd = () => {
    cy.intercept('POST', '**/services/offers', {
        fixture: 'de-microservices/offers/streaming-organic_trial-roll-to-drop-success.json',
    });
    cy.intercept('POST', '**/services/offers/renewal', { fixture: 'de-microservices/offers/renewal/streaming-organic_trial-roll-to-drop-success.json' });
    cy.intercept('POST', '**/services/offers/info', {
        fixture: 'de-microservices/offers/info/streaming-organic_trial-roll-to-drop-success.json',
    });
};

export const stubOffersCustomerSuccessStreamingOrganicTrialRtd = () => {
    cy.intercept('POST', '**/services/offers/customer', { fixture: `de-microservices/offers/customer/streaming-organic_trial-roll-to-drop-success.json` });
    cy.intercept('POST', '**/services/offers/info', {
        fixture: 'de-microservices/offers/info/streaming-organic_trial-roll-to-drop-success.json',
    });
};
