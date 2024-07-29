import { Action, createReducer, on } from '@ngrx/store';
import { setTranslatedSecurityQuestions, setUntranslatedSecurityQuestions } from './actions';
import { SecurityQuestionsModel } from '../data-services/security-questions.type';

export const featureKey = 'securityQuestions';

export interface SecurityQuestionsState {
    translatedSecurityQuestions: SecurityQuestionsModel[];
    untranslatedSecurityQuestions: SecurityQuestionsModel[];
}
const initialState: SecurityQuestionsState = {
    translatedSecurityQuestions: [],
    untranslatedSecurityQuestions: []
};

const stateReducer = createReducer(
    initialState,
    on(setTranslatedSecurityQuestions, (state, { securityQuestions }) => ({ ...state, translatedSecurityQuestions: securityQuestions })),
    on(setUntranslatedSecurityQuestions, (state, { securityQuestions }) => ({ ...state, untranslatedSecurityQuestions: securityQuestions }))
);

export function reducer(state: SecurityQuestionsState, action: Action) {
    return stateReducer(state, action);
}
