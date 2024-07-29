export const stubCancelSubscriptionComplete = () => {
    cy.intercept('POST', '**/services/cancel/subscription', { fixture: 'de-microservices/purchase/cancel/subscription/complete.json' });
};

export const stubPurchaseAddSubscriptionAddRadioRouterSuccess = () => {
    cy.intercept('POST', '**/services/purchase/add-subscription', { fixture: 'de-microservices/purchase/add-subscription/add-radio-router_common_success.json' });
};
export const stubPurchaseAddSubscriptionStreamingCommonSuccess = () => {
    cy.intercept('POST', '**/services/purchase/add-subscription', { fixture: 'de-microservices/purchase/add-subscription/streaming-common_success.json' });
};

export const stubPurchaseAddSubscriptionSatelliteTargetedEligibleForRegistration = () => {
    cy.intercept('POST', '**/services/purchase/add-subscription', {
        fixture: 'de-microservices/purchase/add-subscription/satellite-targeted_eligible-for-registration.json',
    });
};

export const stubPurchaseAddSubscriptionSatelliteTargetedCcFraudError = () => {
    cy.intercept('POST', '**/services/purchase/add-subscription', {
        fixture: 'de-microservices/purchase/add-subscription/satellite-targeted_cc-fraud-error.json',
        statusCode: 400,
    });
};

export const stubPurchaseAddSubscriptionSatelliteTargetedSystemError = () => {
    cy.intercept('POST', '**/services/purchase/add-subscription', {
        fixture: 'de-microservices/purchase/add-subscription/satellite-targeted_system-error.json',
        statusCode: 400,
    });
};

export const stubPurchaseChangeSubscriptionSatelliteOrganicCcFraudError = () => {
    cy.intercept('POST', '**/services/purchase/change-subscription', {
        fixture: 'de-microservices/purchase/change-subscription/satellite-organic_cc-fraud-error.json',
        statusCode: 400,
    });
};

export const stubPurchaseChangeSubscription = () => {
    cy.intercept('POST', '**/services/purchase/change-subscription', { fixture: 'de-microservices/purchase/change-subscription/success.json' });
};

export const stubPurchaseChangeSubscriptionCCFraud = () => {
    cy.intercept('POST', '**/services/purchase/change-subscription', {
        statusCode: 400,
        fixture: 'de-microservices/purchase/change-subscription/credit-card-fraud.json',
    });
};

export const stubPurchaseChangeSubscriptionStreamingCommonSuccess = () => {
    cy.intercept('POST', '**/services/purchase/change-subscription', { fixture: 'de-microservices/purchase/change-subscription/streaming-common_success.json' });
};

export const stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration = () => {
    cy.intercept('POST', '**/services/purchase/change-subscription', {
        fixture: 'de-microservices/purchase/change-subscription/satellite-organic_eligible-for-registration.json',
    });
};

export const stubPurchaseChangeSubscriptionSatelliteOrganicSystemError = () => {
    cy.intercept('POST', '**/services/purchase/change-subscription', {
        fixture: 'de-microservices/purchase/change-subscription/satellite-organic_system-error.json',
        statusCode: 400,
    });
};

export const stubPurchaseChangeSubscriptionSatelliteCommonRegistrationAndStreamingEligible = () => {
    cy.intercept('POST', '**/services/purchase/change-subscription', {
        fixture: 'de-microservices/purchase/change-subscription/satellite-common_registration-and-streaming-eligible.json',
    });
};

export const stubPurchaseNewAccountStreamingAccordionOrganicSuccess = () => {
    cy.intercept('POST', '**/services/purchase/new-account', { fixture: 'de-microservices/purchase/new-account/streaming-accordion-organic_success.json' });
};

export const stubPurchaseNewAccountTransactionPasswordError = () => {
    cy.intercept('POST', '**/services/purchase/new-account', { fixture: 'de-microservices/purchase/new-account/streaming-common_password-error.json', statusCode: 400 });
};

export const stubPurchaseNewAccountStreamingNonAccordionOrganicSuccess = () => {
    cy.intercept('POST', '**/purchase/new-account', { fixture: 'de-microservices/purchase/new-account/streaming-non-accordion-organic_success.json' });
};

export const stubPurchaseNewAccountStreamingNonAccordionOrganicUpsellTerm = () => {
    cy.intercept('POST', '**/purchase/new-account', { fixture: 'de-microservices/purchase/new-account/streaming-non-accordion-organic_upsell-term.json' });
};

export const stubPurchaseNewAccountSatelliteOrganicEligibleForRegistration = () => {
    cy.intercept('POST', '**/services/purchase/new-account', {
        fixture: 'de-microservices/purchase/new-account/satellite-organic_eligible-for-registration.json',
    });
};

export const stubPurchaseNewAccountSatelliteOrganicCcFraudError = () => {
    cy.intercept('POST', '**/services/purchase/new-account', {
        fixture: 'de-microservices/purchase/new-account/satellite-organic_cc-fraud-error.json',
        statusCode: 400,
    });
};

export const stubPurchaseNewAccountSatelliteOrganicSystemError = () => {
    cy.intercept('POST', '**/services/purchase/new-account', {
        fixture: 'de-microservices/purchase/new-account/satellite-organic_system-error.json',
        statusCode: 400,
    });
};

export const stubTransactionInvalidCreditCard = () => {
    cy.intercept('POST', '**/services/purchase/new-account', { fixture: 'de-microservices/purchase/new-account/satellite-organic_cc-fraud-error.json', statusCode: 400 });
};
export const stubTransactionInvalidCreditCardExpiration = () => {
    cy.intercept('POST', '**/services/purchase/new-account', { fixture: 'de-microservices/purchase/new-account/streaming-common_cc-expired-error.json', statusCode: 400 });
};
export const stubTransactionSystemError = () => {
    cy.intercept('POST', '**/services/purchase/new-account', { fixture: 'de-microservices/purchase/new-account/satellite-organic_system-error.json', statusCode: 400 });
};

export const stubPurchaseOffer2OfferSuccess = () => {
    cy.intercept('POST', '**/services/purchase/offer2offer', { fixture: 'de-microservices/purchase/offer2offer/success.json' });
};

export const stubPurchaseSwapRadioSuccess = () => {
    cy.intercept('POST', '**/services/purchase/swap-radio', { fixture: 'de-microservices/purchase/swap-radio/success.json' });
};

export const stubPurchaseUpdateVipSubscription = () => {
    cy.intercept('POST', '**/services/purchase/update-vip-subscription', { fixture: 'de-microservices/purchase/update-vip-subscription/success.json' });
};

export const stubPurchaseTrialActivationAccountConsolidate = () => {
    cy.intercept('POST', '**/services/trial-activation/account-consolidate', {
        fixture: 'de-microservices/purchase/trial-activation/account-consolidate/success.json',
    });
};

export const stubPurchaseTrialActivationNewAccountZeroCostSatelliteOrganicSuccess = () => {
    cy.intercept('POST', '**/services/trial-activation/new-account', {
        fixture: `de-microservices/purchase/trial-activation/new-account/zero-cost-satellite-organic_success.json`,
    });
};

export const stubPurchaseTrialActivationNewAccountZeroCostSatelliteOrganicSystemError = () => {
    cy.intercept('POST', '**/services/trial-activation/new-account', {
        fixture: `de-microservices/purchase/trial-activation/new-account/zero-cost-satellite-organic_system-error.json`,
        statusCode: 500,
    });
};

export const stubPurchaseTrialAccountNewAccountZeroCostSatelliteOrganicUsernameError = () => {
    cy.intercept('POST', '**/services/trial-activation/new-account', {
        fixture: `de-microservices/purchase/trial-activation/new-account/zero-cost-satellite-organic_username-error.json`,
        statusCode: 400,
    });
};

export const stubPurchaseTrialAccountNewAccountZeroCostSatelliteOrganicUsernameInUseError = () => {
    cy.intercept('POST', '**/services/trial-activation/new-account', {
        fixture: `de-microservices/purchase/trial-activation/new-account/zero-cost-satellite-organic_username-in-use-error.json`,
        statusCode: 400,
    });
};

export const stubPurchaseTrialActivationServiceLaneOneClick = () => {
    // GET /services/trial-activation/service-lane-one-click/{token}
    cy.intercept('GET', '**/services/trial-activation/service-lane-one-click/*', {
        fixture: 'de-microservices/purchase/trial-activation/service-lane-one-click/success.json',
    });
};

export const stubPurchaseTrialActivationServiceLaneTwoClick = () => {
    cy.intercept(
        { method: 'POST', path: '**/services/trial-activation/service-lane-two-click' },
        {
            fixture: 'de-microservices/purchase/trial-activation/service-lane-two-click/success.json',
        }
    );
};

export const stubPurchaseTrialActivationAddSubscription = () => {
    cy.intercept(
        { method: 'POST', path: '**/services/trial-activation/add-subscription' },
        {
            fixture: 'de-microservices/purchase/trial-activation/add-subscription/success.json',
        }
    );
};

export const stubPurchaseTrialActivationLastOneClick = () => {
    cy.intercept(
        { method: 'POST', path: '**/services/trial-activation/last-one-click' },
        {
            fixture: 'de-microservices/purchase/trial-activation/last-one-click/success.json',
        }
    );
};

export const stubPurchaseTrialActivationLastOneClickError = () => {
    cy.intercept(
        { method: 'POST', path: '**/services/trial-activation/last-one-click' },
        {
            fixture: 'de-microservices/purchase/trial-activation/last-one-click/error.json',
            statusCode: 500,
        }
    );
};

export const stubPurchaseTrialActivationActivateThirdPartySubscription = () => {
    cy.intercept(
        { method: 'POST', path: '**/services/trial-activation/activate-third-party-subscription' },
        {
            fixture: 'de-microservices/purchase/trial-activation/activate-third-party-subscription/success.json',
        }
    );
};
