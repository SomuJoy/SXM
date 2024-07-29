document.defaultView['appSettings'] = {
    apiUrl: '${API_URL}',
    apiPath: '/services',
    oacUrl: '${OAC_URL}',
    ndClientEnabled: '${ND_ENABLED}',
    ndClientId: '${CLIENT_ID}',
    country: '${COUNTRY_CODE}',
    enableCVV: '${ENABLE_CVV}',
    sheerIdIdentificationWidgetUrl: '${SHEER_ID_WIDGET_URL}',
    sheerIdIdentificationReVerificationWidgetUrl: '${SHEER_ID_WIDGET_RE_VERIFICATION_URL}',
    caOemAppUrl: '${CA_OEM_APP_URL}',
    featureFlags: {
        enableCmsContent: '${ENABLE_CMS_CONTENT}',
    },
    chatProvider: '${CHAT_PROVIDER}',
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
