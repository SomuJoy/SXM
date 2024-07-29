// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { StreamingOnboardingSettings } from '@de-care/de-streaming-onboarding/state-settings';
import { Settings } from '@de-care/shared/state-settings';

export const environment = {
    production: false,
    settings: {
        apiUrl: 'microservices',
        apiPath: '/services',
        country: 'us',
        featureFlags: {
            iapEnableContactUsTelephone: 'true',
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
    } as unknown as Settings,
    streamingOnboardingSettings: {
        legacyOnboardingBaseUrl: 'https://k2uat.siriusxm.com/onboarding',
    } as StreamingOnboardingSettings,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
