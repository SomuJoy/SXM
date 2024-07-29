import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SecurityQuestionsState, featureKey } from './reducer';

export const selectSecurityQuestionsFeature = createFeatureSelector<SecurityQuestionsState>(featureKey);

export const getUntranslatedSecurityQuestions = createSelector(selectSecurityQuestionsFeature, featureState => featureState.untranslatedSecurityQuestions);
export const getSecurityQuestions = createSelector(selectSecurityQuestionsFeature, featureState => featureState?.translatedSecurityQuestions);
