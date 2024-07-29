document.defaultView['appSettings'] = {
    apiUrl: '${API_URL}',
    apiPath: '/services',
    country: '${COUNTRY_CODE}',
    featureFlags: {
        iapEnableContactUsTelephone: '${IAP_ENABLE_TFN}',
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
};
document.defaultView['streamingOnboardingSettings'] = {
    legacyOnboardingBaseUrl: '${LEGACY_ONBOARDING_BASE_URL}',
};
