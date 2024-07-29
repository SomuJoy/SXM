import { createAction, props } from '@ngrx/store';

export const logMessage = createAction(
    '[Log Message Middleware] Log error message',
    props<{
        message: string;
        url: string;
        stacktrace?: string;
        logLevel?: 'INFO' | 'WARN' | 'ERROR';
    }>()
);
