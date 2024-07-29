export interface StreamingOnboardingSettings {
    legacyOnboardingBaseUrl: string;
    synacorPlayerTokenConfig?: {
        baseUrl: string;
        org: string;
    };
}
