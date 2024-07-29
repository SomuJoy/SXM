import { FeatureFlagsInConfig } from '@de-care/shared/state-feature-flags';

export type sxmCountries = 'us' | 'ca';

export interface Settings {
    apiUrl: string;
    apiPath: string;
    oacUrl: string;
    amexMode?: string;
    merchantApiKey?: string;
    amexAuthRedirectUrl?: string;
    cmsUrlBase?: string;
    ndClientEnabled: boolean;
    ndClientId: string;
    amzClientId?: string;
    country: sxmCountries;
    isOem?: boolean;
    sheerIdIdentificationWidgetUrl: string;
    sheerIdIdentificationReVerificationWidgetUrl: string;
    enableCVV: boolean;
    featureFlags?: FeatureFlagsInConfig;
    caOemAppUrl?: string;
    chatProvider: '247' | 'liveperson';
    atdValue?: string | number;
    rtdValue?: string | number;
    dotComUrl?: string;
    dotComRefreshUrl?: string;
    legacyOnboardingBaseUrl: string;
    dotComConfig: {
        navigationDomain: string;
        assetDomain: string;
        sxmNavWidgetJavascriptPath: string;
        sxmNavWidgetEnvironment?: string;

        // Client Side Config
        // importJquery: boolean,
        // sxmNavCssPath: string,
        // sxmNavJavascriptPath: string,
        // lang?: string
    };
    synacorPlayerTokenConfig?: {
        baseUrl: string;
        org: string;
        disableForBrowserUserAgentPlatforms?: string;
    };
    smartLinkUrls: {
        toPlayerApp: string;
        toPlayerAppForInstantStream: string;
    };
    clientSdkBaseUrl?: string;
}

export interface SettingsState {
    settings: Settings;
    isCanadaMode: boolean;
    multiLanguageSupportEnabled: boolean;
    oacRefreshUrl: string;
    isCVVEnabled: boolean;
    featureFlags?: FeatureFlagsInConfig;
}
