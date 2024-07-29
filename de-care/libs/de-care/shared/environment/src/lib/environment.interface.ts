import { Settings } from '@de-care/shared/state-settings';

export interface DeCareEnvironment {
    production: boolean;
    settings: Settings;

    appDynamicsReport?: boolean;

    jsonAssetUrl?: string;

    funnelInstructionsUrl?: string;
    i18n?: {
        PATH: string;
        FORMAT: string;
        LANGUAGES: string[];
        DEFAULT_LANG: string;
    };
}
