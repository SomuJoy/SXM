// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Settings } from '@de-care/settings';

export const environment = {
    production: false,
    moduleFederationRemoteEntries: {
        // 'de_care_use_cases_onboarding': `${document.location.protocol}//${document.location.hostname}:4230/remoteEntry.js`
    },
    settings: {
        apiUrl: 'https://dex-dev.corp.siriusxm.com/dvgllvdexoac04-18030-care',
        apiPath: '/services',
        oacUrl: 'https://careqa.siriusxm.com/OAC-US-1527/',
        cmsUrlBase: 'https://cms-author.corp.siriusxm.com/phx/services/v1/rest/sites/sxm/types',
        dotComUrl: 'https://www.siriusxm.com',
        dotComRefreshUrl: 'https://www.siriusxm.com/refresh',
        ndClientEnabled: true,
        ndClientId: 'w-440133',
        amzClientId: 'amzn1.application-oa2-client.48060fe8f1da423d89d292f45aaca12b',
        country: 'us',
        sheerIdIdentificationWidgetUrl: 'https://offers.sheerid.com/siriusxm-phx/staging/student/',
        sheerIdIdentificationReVerificationWidgetUrl: 'http://offers.sheerid.com/siriusxm-phx/staging/reverification/student/',
        enableCVV: true,
        amexMode: 'qa',
        merchantApiKey: '06645ecdb1fa4d37bc53ce07fae95748',
        featureFlags: {
            enableSl2c: 'true',
            enableQuoteSummary: 'true',
            siriusCustomerDeferUpsell: 'false',
            enableNewStreamingOrganicCheckoutExperience: 'false',
            enableCmsContent: 'true',
            enableStreamingOrganicTrialRTDNonAccordion: 'true',
            enableSatelliteOrganicNonAccordion: 'true',
            enableNewCheckoutStudentVerification: 'true',
            enableNewCheckoutStudentReverification: 'true',
            enableClientSDKIntegration: 'false',
            enableAtlasStreamingOrganicSelfPayNonAccordion: 'false',
        },
        chatProvider: 'liveperson',
        legacyOnboardingBaseUrl: 'https://k2uat.siriusxm.com/onboarding',
        dotComConfig: {
            navigationDomain: 'https://www.siriusxm.com',
            assetDomain: 'https://www.siriusxm.com',
            // Client Side Integration
            sxmNavWidgetJavascriptPath: '/cms/static/global/js/minified/sxm.navwidget.min.js',

            // Server Side Integration
            // importJquery: false,
            // sxmNavCssPath: '/cms/static/global/css/minified/sxm.nav.min.css',
            // sxmNavJavascriptPath: '/cms/static/global/js/minified/sxm.nav.min.js',
            // lang: 'en'
        },
        synacorPlayerTokenConfig: {
            baseUrl: 'https://link-orch.sit05.idm.siriusxm.com',
            org: 'sxm_sit05',
            disableForBrowserUserAgentPlatforms: 'ios',
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

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
