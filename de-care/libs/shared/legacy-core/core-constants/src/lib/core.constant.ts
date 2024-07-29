// Dynamic Routes Json URLs
const _dynamicRouteKeys = {
    DEFAULT: 'newsxir',
    ESN: 'newesn',
    SXIR: 'newsxir',
    MILITARY25: 'military25',
    ARRAY: ['newesn', 'newsxir', 'military25']
};

// Module names
const _moduleNames = {
    // Root
    APP: 'app',

    // Eager-loaded
    CORE: 'core',
    SHARED: 'shared',
    LAYOUT: 'layout',
    DATA: 'data-services',

    // Lazy-loaded
    ACCOUNT: 'account',
    PACKAGE: 'package',
    CHECKOUT: 'checkout'
};

// Routes Redirects
const _routeNavUrls = {
    // Account Module
    REGISTER: '/account/register',
    ACCOUNT_INTERSTITIAL: '/account/interstitial',

    // Package Module
    PACKAGE: '/package',

    // Checkout Module
    CHECKOUT_INTERSTITIAL: '/pages/checkout/interstitial',
    PAYMENT: '/pages/checkout/payment',
    REVIEW: '/pages/checkout/review',
    THANKS: '/pages/checkout/thanks',

    //Core Module: Internal Server Error
    INTERNAL_ERROR: '/issue',

    // Used by Checkout Thanks page to redirect
    STREAM_NOW: 'https://player.siriusxm.com',

    // If Customer already registered
    LOGIN: 'https://player.siriusxm.com/'
};

// Keys used to store into Session or Local storage
const _storageKeys = {
    TOKEN: 'token',
    EMAIL: 'email',
    CHECKOUT: 'Checkout',
    PLAN: 'Plan',
    LANGUAGE: 'Language',
    CARD_PROCESSED: 'Card Processed'
};

// Response Codes
const _resCodes = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    TEMPORARY_REDIRECT: 307,
    RESUME_INCOMPLETE: 308,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    REQUESTED_RANGE_NOT_SATISFIABLE: 416,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
};

//********************************************************************************
// Constant (Core)
export const CoreConstant = {
    // All Module level constants goes here
    STORAGE_KEY_PREFIX: 'siriusxmws',

    APP_DYNAMICS_ERR_INDEX: 0,

    SECURED_CREDIT_CARD_DIGITS: 4,

    AB_TESTING_PROMISE_TIMEOUT: 4000,

    MODULE: _moduleNames,
    ROUTE_URL: _routeNavUrls,

    STORAGE_KEY: _storageKeys,
    RESP_CODE: _resCodes,

    ROUTE_KEY: _dynamicRouteKeys,

    STORE: {
        NAME: 'appRootStore'
    }
};
