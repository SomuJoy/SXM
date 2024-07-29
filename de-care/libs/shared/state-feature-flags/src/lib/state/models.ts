export type FeatureFlagStatus = 'true' | 'false' | '';

// Helper for creating a mapper that maps from original value to function that returns boolean (for overrides)
type MapToPredicate<T> = {
    [P in keyof T]?: (val: T[P]) => boolean;
};

type MapToBoolean<T> = {
    [P in keyof T]: boolean;
};

export function mapLooseTrue(val: string) {
    return val?.toLowerCase() === 'true' || false;
}

/**
 * Update this type so that you can use autocomplete in the app
 */
export interface FeatureFlagsInConfig {
    enableSl2c?: FeatureFlagStatus;
    siriusCustomerDeferUpsell?: FeatureFlagStatus;
    enableQuoteSummary?: FeatureFlagStatus;
    enableNewStreamingOrganicCheckoutExperience?: FeatureFlagStatus;
    enableCmsContent?: FeatureFlagStatus;
    iapEnableContactUsTelephone?: FeatureFlagStatus;
    enableStreamingOrganicTrialRTDNonAccordion?: FeatureFlagStatus;
    enableSatelliteOrganicNonAccordion?: FeatureFlagStatus;
    enableNewCheckoutStudentVerification?: FeatureFlagStatus;
    enableNewCheckoutStudentReverification?: FeatureFlagStatus;
    adobeFlags: { [key: string]: any };
    enableClientSDKIntegration?: FeatureFlagStatus;
    enableAtlasStreamingOrganicSelfPayNonAccordion?: FeatureFlagStatus;
}

export type FeatureFlagsInApp = MapToBoolean<FeatureFlagsInConfig>;
export type FeatureFlagMapper = MapToPredicate<FeatureFlagsInConfig>;

/**
 * Use this to override the parsing behavior for the feature flag values. The predicate should always return a boolean.
 * E.g. enableSl2c: val => val === 'enable'
 */
export const featureFlagMapOverrides: FeatureFlagMapper = {};
