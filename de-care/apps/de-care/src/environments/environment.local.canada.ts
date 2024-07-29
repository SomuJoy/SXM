import { Settings } from '@de-care/settings';

export const environment = {
    production: false,
    moduleFederationRemoteEntries: {
        // 'de_care_use_cases_onboarding': `${document.location.protocol}//${document.location.hostname}:4231/remoteEntry.js`
    },
    settings: {
        apiUrl: 'microservices',
        apiPath: '/services',
        oacUrl: 'https://careqa.siriusxm.com/OAC-US-1536/',
        cmsUrlBase: 'https://cms-author.corp.siriusxm.com/phx/services/v1/rest/sites/sxm/types',
        dotComUrl: 'https://www.siriusxm.ca',
        dotComRefreshUrl: 'https://www.siriusxm.ca/refresh',
        ndClientEnabled: true,
        ndClientId: 'w-440133',
        amzClientId: 'amzn1.application-oa2-client.03812cdee2c8423986def8bf9cdac383',
        country: 'ca',
        sheerIdIdentificationWidgetUrl: 'https://offers.sheerid.com/siriusxm-phx/staging/international-student/',
        sheerIdIdentificationReVerificationWidgetUrl: 'http://offers.sheerid.com/siriusxm-phx/staging/reverification/international-student/',
        enableCVV: true,
        featureFlags: {
            enableSl2c: 'true',
            siriusCustomerDeferUpsell: 'true',
            enableQuoteSummary: 'true',
            enableNewStreamingOrganicCheckoutExperience: 'false',
            enableCmsContent: 'true',
            enableStreamingOrganicTrialRTDNonAccordion: 'true',
            enableSatelliteOrganicNonAccordion: 'true',
            enableNewCheckoutStudentVerification: 'true',
            enableNewCheckoutStudentReverification: 'true',
            enableClientSDKIntegration: 'false',
            enableAtlasStreamingOrganicSelfPayNonAccordion: 'false',
        },
        chatProvider: '247',
        dotComConfig: {
            navigationDomain: 'https://www.siriusxm.com',
            assetDomain: 'https://www.siriusxm.com',
            // Client Side Integration
            sxmNavWidgetJavascriptPath: '/cms/static/global/js/minified/sxm.navwidget.min.js',
            // sxmNavWidgetEnvironment: 'staging',
            // importJquery: true,
            // sxmNavJavascriptPath: '/wp-content/themes/siriusxm/dist/scripts/pega-nav_8330d6b4.js',
            // sxmNavCssPath: '/wp-content/themes/siriusxm/dist/styles/main_8330d6b4.css',
            // lang: 'fr'
        },
        synacorPlayerTokenConfig: {
            baseUrl: 'https://link-orch.sit05.idm.siriusxm.com',
            org: 'sxm_sit05',
            disableForBrowserUserAgentPlatforms: '',
        },
        smartLinkUrls: {
            toPlayerApp: 'https://sxm.smart.link/r796r1qs0',
            toPlayerAppForInstantStream: ' https://smart.link/ojbq0do6xw686',
        },
        clientSdkBaseUrl: '',
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
