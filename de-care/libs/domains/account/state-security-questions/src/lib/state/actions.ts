import { createAction, props } from '@ngrx/store';
import { SecurityQuestionsModel } from '../data-services/security-questions.type';

export const fetchSecurityQuestions = createAction('[Security questions] Fetch security questions', props<{ accountRegistered: boolean }>());
export const setUntranslatedSecurityQuestions = createAction(
    '[Security questions] Set untranslated security questions',
    props<{ securityQuestions: SecurityQuestionsModel[] }>()
);
export const setTranslatedSecurityQuestions = createAction('[Security questions] Set translated security questions', props<{ securityQuestions: SecurityQuestionsModel[] }>());
