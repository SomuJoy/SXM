import { createSelector, createFeatureSelector } from '@ngrx/store';
import { featureKey, TrialActivationAdSupportedTierOneClickState } from './reducer';

export const selectFeatureState = createFeatureSelector<TrialActivationAdSupportedTierOneClickState>(featureKey);
export const getConfirmationPageParams = createSelector(selectFeatureState, state => ({
    radioId: state.radioId
}));
export const areConfirmationPageParamsValid = createSelector(getConfirmationPageParams, confirmationPageParams => !!confirmationPageParams.radioId);
