import { Settings } from '@de-care/settings';

export const environment = {
    production: false,
    settings: {
        apiUrl: 'https://dex-dev.corp.siriusxm.com/dvgllvdexoac05-17610-care',
        apiPath: '/services',
        oacUrl: 'https://careqa.siriusxm.com/OAC-US-1528/',
        ndClientEnabled: true,
        ndClientId: 'w-440133',
        country: 'ca',
        sheerIdIdentificationWidgetUrl: 'https://offers.sheerid.com/siriusxm-phx/staging/international-student/',
        sheerIdIdentificationReVerificationWidgetUrl: 'http://offers.sheerid.com/siriusxm-phx/staging/reverification/international-student/',
        featureFlags: {
            enableCmsContent: 'true',
        },
        chatProvider: '247',
        legacyOnboardingBaseUrl: 'http://mcareuat2.siriusxm.com/onboarding',
        synacorPlayerTokenConfig: {
            baseUrl: 'https://link-orch.sit05.idm.siriusxm.com',
            org: 'sxm_sit05',
            disableForBrowserUserAgentPlatforms: '',
        },
        smartLinkUrls: {
            toPlayerApp: 'https://sxm.smart.link/r796r1qs0',
            toPlayerAppForInstantStream: ' https://smart.link/ojbq0do6xw686',
        },
    } as Settings,

    appDynamicsReport: true,

    jsonAssetUrl: 'assets/json',

    funnelInstructionsUrl: 'assets/json/funnel-instructions.json',
    i18n: {
        PATH: 'assets/i18n',
        FORMAT: '.json',
        LANGUAGES: ['en', 'fr'],
        DEFAULT_LANG: 'en',
    },
};
