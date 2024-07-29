import { Settings } from '@de-care/settings';
import { environment as developmentEnvironment } from './environment.local';

export const environment = {
    ...developmentEnvironment,
    settings: {
        ...developmentEnvironment.settings,
        featureFlags: {
            ...developmentEnvironment.settings.featureFlags,
            enableClientSDKIntegration: 'true',
            enableAtlasStreamingOrganicSelfPayNonAccordion: 'true',
        },
        clientSdkBaseUrl: 'https://edge.test.core-services.jedi.siriusxm.com',
    } as Settings,
};
