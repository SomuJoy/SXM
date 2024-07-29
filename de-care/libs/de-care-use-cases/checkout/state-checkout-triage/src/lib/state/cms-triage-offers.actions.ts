import { createAction, props } from '@ngrx/store';

export const setRenewalPackageNameAndLoadOffersInfo = createAction(
    '[Checkout] select renewal package name and load offers info',
    props<{
        payload: {
            packageName: string;
        };
    }>()
);
