import { createAction, props } from '@ngrx/store';

export const resetAccountSessionInfo = createAction('[Account Session Info] Reset account session info');
export const setAccountSessionInfo = createAction(
    '[Account Session Info] Set account session info',
    props<{
        sessionInfo: {
            firstName: string | null;
            lastName: string | null;
            zipCode: string | null;
            email: string | null;
            phoneNumber: string | null;
        };
    }>()
);
