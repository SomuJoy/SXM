import { selectFeatureFlagState } from './reducer';
import { createSelector } from '@ngrx/store';

export const getFeatureFlagEnableSl2c = createSelector(selectFeatureFlagState, flags => flags.enableSl2c);
export const getFeatureFlagEnableQuoteSummary = createSelector(selectFeatureFlagState, flags => ({ enableQuoteSummary: flags.enableQuoteSummary }));
export const getFeatureFlagNewStreamingOrganicCheckoutExperience = createSelector(
    selectFeatureFlagState,
    ({ enableNewStreamingOrganicCheckoutExperience }) => enableNewStreamingOrganicCheckoutExperience
);
export const getFeatureFlagEnableCmsContent = createSelector(selectFeatureFlagState, ({ enableCmsContent }) => !!enableCmsContent);
export const getFeatureFlagIapEnableContactUsTelephone = createSelector(selectFeatureFlagState, ({ iapEnableContactUsTelephone }) => !!iapEnableContactUsTelephone);
export const getAdobeFeatureFlags = createSelector(selectFeatureFlagState, state => state?.adobeFlags);
