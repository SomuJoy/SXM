import { createAction, props } from '@ngrx/store';

interface ErrorSummaryInfo {
    message: string;
    errorCode?: string;
    stacktrace?: string;
}

export const behaviorEventErrorsFromUserInteraction = createAction('[Behavior Event] Errors - user interaction', props<{ errors: string[] }>());
/**
 * @deprecated Use behaviorEventErrorsFromUserInteraction that supports array of error messages
 */
export const behaviorEventErrorFromUserInteraction = createAction('[Behavior Event] Error - user interaction', props<{ message: string }>());
export const behaviorEventErrorFromBusinessLogic = createAction('[Behavior Event] Error - business logic', props<ErrorSummaryInfo>());
export const behaviorEventErrorFromAppCode = createAction('[Behavior Event] Error - app code', props<{ error: any }>());
export const behaviorEventErrorFromHttpCall = createAction('[Behavior Event] Error - http call', props<{ error: any }>());
export const behaviorEventErrorFromSystem = createAction('[Behavior Event] Error - system', props<ErrorSummaryInfo>());

export const behaviorEventErrorTypeInfo = createAction('', props<{ message: string; stacktrace?: string }>());
export const behaviorEventErrorTypeWarn = createAction('', props<{ message: string; stacktrace?: string }>());
