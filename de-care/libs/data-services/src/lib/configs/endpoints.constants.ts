export const ENDPOINTS_CONSTANTS = {
    //Account API
    ACCOUNT: '/account',
    ACCOUNT_NON_PII: '/account/non-pii',
    ACCOUNT_REGISTER: '/account/register',
    ACCOUNT_TOKEN: '/account/token',
    ACCOUNT_UPDATE_ADDRESS: '/account/update-address',
    ACCOUNT_VERIFY: '/account/verify',
    ACCOUNT_OEM: '/account/oem',
    ACCOUNT_ACTIVATE_TRIAL: '/account/activate-trial',

    //Account Management API
    ACCOUNT_MGMT_PREFERENCES_DONOTCALL: '/account-mgmt/preferences/donotcall',

    //Authenticate API
    AUTHENTICATE_LOGIN: '/authenticate/login',
    AUTHENTICATE_LINKING_AMAZON: '/authenticate/linking/amazon',

    //Customer info from session
    CUSTOMER_INFO: '/account/customer-info',

    //Device API
    DEVICE_INFO: '/device/info',
    DEVICE_REFRESH: '/device/refresh',
    DEVICE_REFRESH_INSTRUCTION: '/device/send-refresh-instruction',
    DEVICE_SERVICE_INFO: '/device/serviceinfo',
    DEVICE_VALIDATE: '/device/validate',

    //Identity API
    /**
     * @deprecated This is now part of LoadAccountSubscriptionFromEmailWorkflowService in @de-care/domains/account/state-account
     */
    IDENTITY_CUSTOMER_EMAIL: '/identity/customer/email',
    IDENTITY_CUSTOMER_FLEPZ: '/identity/customer/flepz',
    IDENTITY_CUSTOMER_HOUSEHOLD: '/identity/customer/household',
    IDENTITY_CUSTOMER_PHONE: '/identity/customer/phone',
    /**
     * @deprecated This is now part of LicencePlateLookupService in @de-care/domains/device/state-device-validate
     */
    IDENTITY_DEVICE_LICENSE_PLATE: '/identity/device/license-plate',
    IDENTITY_TOKEN: '/identity/token',

    //Offers API
    OFFERS: '/offers',
    OFFERS_CUSTOMER: '/offers/customer',
    /**
     * @deprecated Use @de-care/domains/offers/state-package-descriptions for working with package descriptions
     */
    OFFERS_ALL_PACKAGE_DESC: '/offers/all-package-desc',
    OFFERS_UPSELL: '/offers/upsell',
    OFFERS_PROMOCODE_VALIDATE: '/offers/promocode/validate',
    OFFERS_RENEWAL: '/offers/renewal',
    OFFERS_FOLLOW_ON: '/offers/followon',

    //Payment API
    PAYMENT_CREDITCARD_VALIDATE: '/payment/creditcard/validate',
    PAYMENT_GIFTCARD_INFO: '/payment/giftcard/info',
    PAYMENT_GIFTCARD_REDEEM: '/payment/giftcard/redeem',
    PAYMENT_GIFTCARD_REMOVE: '/payment/giftcard/remove',

    //Purchase API
    PURCHASE_ADD_SUBSCRIPTION: '/purchase/add-subscription',
    PURCHASE_CHANGE_SUBSCRIPTION: '/purchase/change-subscription',
    PURCHASE_CREATE_ACCOUNT: '/purchase/new-account',
    PURCHASE_ACTIVATE_TRIAL_NEW_ACCOUNT: '/trial-activation/new-account',
    PURCHASE_ACTIVATE_TRIAL_ADD_SUBSCRIPTION: '/trial-activation/add-subscription',
    PURCHASE_ACTIVATE_SLOC_TRIAL: '/trial-activation/service-lane-one-click',

    //Quotes API
    QUOTES_PURCHASE_PRICE: '/quotes/purchase-price',

    //Trial API
    TRIAL: '/trial',
    PROSPECT_TRIAL_TOKEN: '/trial/prospect-token',
    TRIAL_USED_CAR_ELIGIBILITY_CHECK: '/trial/used-car-eligibility-check',

    //Utility API
    UTILITY_CAPTCHA_NEW: '/utility/captcha/new',
    UTILITY_ENV_INFO: '/utility/env-info',
    UTILITY_IP2_LOCATION: '/utility/ip2location',
    UTILITY_LOGGING: '/utility/log-message',
    UTILITY_PORTAL_TIME: '/utility/portal-time',
    UTILITY_SECURITY_QUESTIONS: '/utility/security-questions',

    //Validate API
    VALIDATE_ADDRESS: '/validate/address',
    VALIDATE_CUSTOMER_INFO: '/validate/customer-info',
    VALIDATE_EMAIL: '/validate/email',
    VALIDATE_PASSWORD: '/validate/password',
    VALIDATE_UNIQUE_LOGIN: '/validate/unique-login',

    //Account mgmt
    ACCOUNT_MGMT_SWEEPSTAKES: '/account-mgmt/sweepstakes',
};
