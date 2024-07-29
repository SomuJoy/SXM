import { Settings } from '@de-care/shared/state-settings';

export const environment = {
    production: true,
    moduleFederationRemoteEntries: {
        // 'de_care_use_cases_onboarding': `${document.location.protocol}//${document.location.hostname}/micros/onboarding/remoteEntry.js`
    },
    settings: {} as Partial<Settings>, // empty object for prod settings because these come from settings.js file to support deployment configs

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
