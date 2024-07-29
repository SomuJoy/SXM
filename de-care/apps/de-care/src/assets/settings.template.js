document.defaultView['appSettings'] = {
    apiUrl: '${API_URL}',
    apiPath: '/services',
    oacUrl: '${OAC_URL}',
    cmsUrlBase: '${CMS_URL_BASE}',
    dotComUrl: '${DOTCOM_URL}',
    dotComRefreshUrl: '${DOT_COM_REFRESH_PATH}',
    ndClientEnabled: '${ND_ENABLED}',
    ndClientId: '${CLIENT_ID}',
    amzClientId: '${INF_OAC_APP_LOGIN_WITH_AMAZON_CLIENTID}',
    country: '${COUNTRY_CODE}',
    sheerIdIdentificationWidgetUrl: '${SHEER_ID_WIDGET_URL}',
    sheerIdIdentificationReVerificationWidgetUrl: '${SHEER_ID_WIDGET_RE_VERIFICATION_URL}',
    enableCVV: '${ENABLE_CVV}',
    amexMode: '${AMEX_MODE}',
    merchantApiKey: '${AMEX_MERCHANT_API_KEY}',
    amexAuthRedirectUrl: '${AMEX_AUTH_REDIRECT_URL}',
    featureFlags: {
        enableSl2c: '${ENABLE_SL2C}',
        siriusCustomerDeferUpsell: '${SIRIUS_FLEPZ_DEFER_UPSELL}',
        enableQuoteSummary: '${ENABLE_QUOTE_SUMMARY}',
        enableNewStreamingOrganicCheckoutExperience: '${ENABLE_NEW_STREAMING_ORGANIC_CHECKOUT_EXPERIENCE}',
        enableCmsContent: 'true',
        enableStreamingOrganicTrialRTDNonAccordion: '${ENABLE_STREAMING_ORGANIC_TRIAL_RTD_NON_ACCORDION}',
        enableSatelliteOrganicNonAccordion: '${ENABLE_SATELLITE_ORGANIC_NON_ACCORDION}',
        enableNewCheckoutStudentVerification: '${ENABLE_CHECKOUT_STUDENT_VERIFICATION}',
        enableNewCheckoutStudentReverification: '${ENABLE_CHECKOUT_STUDENT_REVERIFICATION}',
        enableClientSDKIntegration: '${ENABLE_CLIENT_SDK_INTEGRATION}',
        enableAtlasStreamingOrganicSelfPayNonAccordion: '${ENABLE_ATLAS_STREAMING_ORGANIC_SELF_PAY_NON_ACCORDION}',
    },
    chatProvider: '${CHAT_PROVIDER}',
    legacyOnboardingBaseUrl: '${LEGACY_ONBOARDING_BASE_URL}',
    dotComConfig: {
        navigationDomain: '${DOT_COM_SHELL_NAVIGATION_DOMAIN}',
        assetDomain: '${DOT_COM_SHELL_ASSET_DOMAIN}',
        sxmNavWidgetJavascriptPath: '${DOT_COM_SHELL_JAVASCRIPT_PATH}',
        sxmNavWidgetEnvironment: '${DOT_COM_SHELL_NAV_WIDGET_ENVIRONMENT}',
    },
    synacorPlayerTokenConfig: {
        baseUrl: '${SYNACOR_BASE_URL}',
        org: '${SYNACOR_ORG}',
        disableForBrowserUserAgentPlatforms: '${SYNACOR_DISABLE_FOR_BROWSER_USER_AGENT_PLATFORMS}',
    },
    smartLinkUrls: {
        toPlayerApp: '${SMART_LINK_URL_TO_PLAYER_APP}',
        toPlayerAppForInstantStream: '${SMART_LINK_URL_TO_PLAYER_APP_FOR_INSTANT_STREAM}',
    },
    clientSdkBaseUrl: '${CLIENT_SDK_BASE_URL}',
};
