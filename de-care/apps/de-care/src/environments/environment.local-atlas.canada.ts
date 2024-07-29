import { Settings } from '@de-care/settings';
import { environment as developmentCanadaEnvironment } from './environment.local.canada';

export const environment = {
    ...developmentCanadaEnvironment,
    settings: {
        ...developmentCanadaEnvironment.settings,
        featureFlags: {
            ...developmentCanadaEnvironment.settings.featureFlags,
            enableClientSDKIntegration: 'true',
            enableAtlasStreamingOrganicSelfPayNonAccordion: 'true',
        },
        clientSdkBaseUrl: 'https://edge.test.core-services.jedi.siriusxm.com',
    } as Settings,
};
