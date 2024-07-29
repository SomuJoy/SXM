import { createAction, props } from '@ngrx/store';

export const loadCountryCode = createAction(
    '[Checkout Student Verification] Load Country Code ',
    props<{
        countryCode: string;
    }>()
);

export const setSheerIdWidgetStudentVerificationUrl = createAction(
    '[Checkout Student Verification] Set SheerId Widget Verification Url',
    props<{
        sheerIdWidgetIdentificationUrl: string;
    }>()
);
