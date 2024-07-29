// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Settings } from '@de-care/settings';
import { ElementsSettings } from '@de-care/elements';

export const environment = {
    production: false,
    elementsSettings: {
        rflzSuccessUrl: ':4201/activate/trial',
        flepzSuccessUrl: ':4201/subscribe/checkout',
        nouvRtpUrl: ':4201/activate/trial/rtp',
        promocodeValidationBaseRedirectUrl: ':4201/subscribe/checkout/streaming',
        promocodeValidationBaseAccordionRedirectUrl: ':4201/subscribe/checkout/purchase/streaming/organic',
        rflzErrorCodeStreamingRedirectUrl: ':4201/subscribe/checkout/streaming/ineligible-redirect',
        rflzErrorCodeFlepzRedirectUrl: ':4201/subscribe/checkout/flepz/ineligible-redirect',
        streamingFlepzSuccessUrl: ':4201/onboarding/setup-credentials/lookup',
    } as ElementsSettings,
    settings: {
        apiUrl: 'https://dex-dev.corp.siriusxm.com/dvgllvdexoac02-18060-care',
        apiPath: '/services',
        oacUrl: 'https://careqa.siriusxm.com/OAC-US-1526/',
        ndClientEnabled: true,
        ndClientId: 'w-440133',
        country: 'ca',
        sheerIdIdentificationWidgetUrl: 'https://offers.sheerid.com/siriusxm-phx/staging/international-student/',
        sheerIdIdentificationReVerificationWidgetUrl: 'http://offers.sheerid.com/siriusxm-phx/staging/reverification/international-student/',
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
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
