import { ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { CustomerValidateResponse, CustomerValidation, DataValidationService, UserNameValidation } from '@de-care/data-services';
import { Observable, of, timer } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, first, map, switchMap, tap } from 'rxjs/operators';

export function atLeastTwoWordsValidator(control: AbstractControl): null | Object {
    // If there is a value and there is no space then it is invalid
    return control.value && control.value.trim().indexOf(' ') === -1 ? { atLeastTwoWords: true } : null;
}

const flaggedSecurityCodeValidators = /^(?=.*(CVV|CAV|CVC|CID|SecurityID|SecurityCode|Security\#))(?=.*([0-9]{3,})).+/i;

export function cvvExclusionValidator(control: AbstractControl): null | Object {
    return flaggedSecurityCodeValidators.test(control.value) ? { cvvExclusion: true } : null;
}

const visaRegExPattern = /^4[0-9]{12}(?:[0-9]{3})?$/;
const masterCardRegExPattern = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/;
const amexRegExPattern = /^3[47][0-9]{13}$/;
const dinersClubRegExPattern = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/;
const discoverRegExPattern = /^6(?:011|5[0-9]{2})[0-9]{12}$/;
const jbcRegExPattern = /^(?:2131|1800|35\d{3})\d{11}$/;
/* tslint:disable */
const unionPayRegExPattern =
    /^81[0-6][0-9]{13}$|^817[0-1][0-9]{12}$|^621094[0-9]{10}$|^62[4-6][0-9]{13}$|^628[2-8][0-9]{12}$|^62292[6-9][0-9]{10}$|^6229[3-9][0-9]{11}$|^623[0-6][0-9]{12}$|^6237[0-8][0-9]{11}$|^62379[0-6][0-9]{10}$/;
/* tslint:enable */
const radioIdLike = /^([A-Za-z0-9]{8}|[A-Za-z0-9]{10}|[A-Za-z0-9]{12}|[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4}|\*{1,8}[A-Za-z0-9]{4})$/;
const vinLike = /^[A-Za-z0-9]{17}$/;
const vinMaskedLike = /^\*{6,14}[A-z0-9]{4}$/;

export function getCreditCardExpiredValidator(date: { month: number; year: number }): (control: AbstractControl) => object | null {
    return (control: AbstractControl) => {
        const value = control.value;
        if (value) {
            const matches: string[] = value.match(/([\d]{1,2})\/*([\d]{1,2})?/);
            if (parseInt(`20${matches[2]}`, 10) < date.year || (parseInt(`20${matches[2]}`, 10) === date.year && parseInt(matches[1], 10) < date.month) || value.length < 5) {
                return { invalidDate: true };
            }
        }
        return null;
    };
}

export function creditCardValidator(control: AbstractControl): null | Object {
    const value = control.value ? control.value.trim() : null;
    if (
        !value ||
        !(
            visaRegExPattern.test(value) ||
            masterCardRegExPattern.test(value) ||
            amexRegExPattern.test(value) ||
            dinersClubRegExPattern.test(value) ||
            discoverRegExPattern.test(value) ||
            jbcRegExPattern.test(value) ||
            unionPayRegExPattern.test(value)
        )
    ) {
        return {
            inValidCard: true,
        };
    }
    return null;
}

export function buildCvvLengthValidator(creditCardControl: AbstractControl): (control: AbstractControl) => null | Object {
    return (cvvControl: AbstractControl) => {
        if (amexRegExPattern.test(creditCardControl.value)) {
            return cvvControl.value && cvvControl.value.length === 4 ? null : { cvvLengthError: true };
        } else {
            return cvvControl.value && cvvControl.value.length === 3 ? null : { cvvLengthError: true };
        }
    };
}

export function controlIsInvalid(customValidation: (control: AbstractControl) => boolean = () => true): (control: AbstractControl) => boolean {
    return (control: AbstractControl): boolean => {
        if (!!control) {
            return control.invalid && (control.dirty || control.touched || customValidation(control));
        }
        return true;
    };
}

export const getValidateUniqueUserNameLoginServerFn = (
    dataValidationService: DataValidationService,
    time: number = 250,
    changeDetectorRef?: ChangeDetectorRef,
    verifyThirdParty: boolean = false,
    streaming: boolean = false
): ((control: FormControl) => Observable<{ [key: string]: boolean }>) => {
    return (control: FormControl): Observable<{ [key: string]: boolean }> => {
        const payload: CustomerValidation = {
            ...(verifyThirdParty && { verifyThirdParty }),
            email: { email: control.value, ...(streaming && { streaming }) },
            username: {
                userName: control.value,
            },
        };
        return timer(time).pipe(
            switchMap(() => dataValidationService.validateCustomerInfo(payload, false)),
            map((response: CustomerValidateResponse) => {
                if (changeDetectorRef) {
                    changeDetectorRef.markForCheck();
                }
                if (response.valid) {
                    return null;
                }
                if (!response.usernameValidation.valid) {
                    return { usernameInUse: true };
                }
            }),
            catchError(() => {
                return of({ usernameInUse: true });
            }),
            first()
        );
    };
};

export const getValidateUniqueLoginServerFn = (
    dataValidationService: DataValidationService,
    time: number = 250,
    changeDetectorRef?: ChangeDetectorRef,
    verifyThirdParty: boolean = false,
    streaming: boolean = false
): ((control: FormControl) => Observable<{ [key: string]: boolean }>) => {
    return (control: FormControl): Observable<{ [key: string]: boolean }> => {
        const payload: CustomerValidation = {
            ...(verifyThirdParty && { verifyThirdParty }),
            email: { email: control.value, ...(streaming && { streaming }) },
            username: {
                userName: control.value,
            },
        };
        return timer(time).pipe(
            switchMap(() => dataValidationService.validateCustomerInfo(payload, false)),
            map((response: CustomerValidateResponse) => {
                if (changeDetectorRef) {
                    changeDetectorRef.markForCheck();
                }
                if (response.valid) {
                    return null;
                }
                if (!response.usernameValidation.valid) {
                    return { usernameInUse: true };
                } else {
                    return { invalidEmail: true };
                }
            }),
            catchError(() => {
                return of({ invalidEmail: true });
            }),
            first()
        );
    };
};

/**
 * @deprecated Use getValidateUniqueLoginServerFn instead
 */
export const getValidateEmailByServerFn = (
    dataValidationService: DataValidationService,
    time: number = 250,
    changeDetectorRef?: ChangeDetectorRef,
    verifyThirdParty: boolean = false,
    streaming: boolean = false
): ((control: FormControl) => Observable<{ [key: string]: boolean }>) => {
    return (control: FormControl): Observable<{ [key: string]: boolean }> => {
        const payload: CustomerValidation = {
            ...(verifyThirdParty && { verifyThirdParty }),
            email: { email: control.value, ...(streaming && { streaming }) },
            username: {
                userName: control.value,
            },
        };
        return timer(time).pipe(
            switchMap(() => dataValidationService.validateCustomerInfo(payload, false)),
            map((response: CustomerValidateResponse) => {
                if (changeDetectorRef) {
                    changeDetectorRef.markForCheck();
                }
                if (response.valid) {
                    return null;
                }
                if (!response.usernameValidation.valid) {
                    return { usernameInUse: true };
                } else {
                    return { invalidEmail: true };
                }
            }),
            catchError(() => {
                return of({ invalidEmail: true });
            }),
            first()
        );
    };
};

export const getValidateUserNameByServerFn = (
    dataValidationService: DataValidationService,
    useEmailAsUsername: boolean,
    time: number = 250,
    changeDetectorRef?: ChangeDetectorRef
): ((control: FormControl) => Observable<{ [p: string]: boolean }>) => {
    return (control: FormControl): Observable<{ [key: string]: boolean }> => {
        if (useEmailAsUsername) {
            return of(null);
        } else if (!/^[a-zA-Z0-9]{6,20}$/.test(control.value)) {
            return of({ invalidUsername: true });
        }
        const payload: UserNameValidation = {
            userName: control.value,
            reuseUserName: true,
        };
        return timer(time).pipe(
            switchMap(() => dataValidationService.validateUserName(payload, false)),
            map((response: CustomerValidateResponse) => {
                if (changeDetectorRef) {
                    changeDetectorRef.markForCheck();
                }
                if (response.valid) {
                    return null;
                } else {
                    return { usernameInUse: true };
                }
            }),
            catchError(() => {
                return of({ invalidUsername: true });
            }),
            first()
        );
    };
};

export function getValidateUserNameFromServer(dataValidationService: DataValidationService, onCompleteCallback?: () => void) {
    return (control: FormControl) =>
        control.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((userName) =>
                dataValidationService.validateUserName({
                    userName,
                    reuseUserName: true,
                })
            ),
            map((response: CustomerValidateResponse) => (response?.valid ? null : { usernameInUse: true })),
            catchError(() => of({ invalidUsername: true })),
            tap(() => onCompleteCallback && onCompleteCallback()),
            first()
        );
}

export function getValidatePasswordServerFn(dataValidationService: DataValidationService, onCompleteCallback?: () => void) {
    return (control: AbstractControl) => {
        const generalInvalidResponse = { policy: true };
        return control.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((value) => dataValidationService.validatePassword(value)),
            map((response) => {
                if (response.valid) {
                    return null;
                } else {
                    switch (response.validationErrorKey) {
                        case 'validation.password.new.dictionaryWords': {
                            return { reservedWords: { words: [response.validationErrorFailedWord] } };
                        }
                        case 'validation.password.new.charsAllowed': {
                            return { generic: true };
                        }
                        default: {
                            return generalInvalidResponse;
                        }
                    }
                }
            }),
            catchError(() => of(generalInvalidResponse)),
            tap(() => {
                if (onCompleteCallback) {
                    onCompleteCallback();
                }
            }),
            first()
        );
    };
}

const containsCreditCardInfoPattern = /\D*(?:\d\D*){13,}/;
export function containsCreditCardInfoValidator(control: AbstractControl): null | Object {
    return containsCreditCardInfoPattern.test(control.value) ? { containsCCInfo: true } : null;
}

export function radioIdOrVinValidator(control: AbstractControl): null | Object {
    const trimmedValue = control?.value?.trim();

    if (!trimmedValue || !(radioIdLike.test(trimmedValue) || vinLike.test(trimmedValue) || vinMaskedLike.test(trimmedValue))) {
        return { invalidRadioIdOrVin: true };
    }
    return null;
}

export function minMaxNumberValidator(min: number = 0, max: number = Infinity) {
    return (control: AbstractControl) => {
        const valueLength = control?.value?.toString().length || 0;

        return valueLength < min ? { minValue: { valid: false } } : valueLength > max ? { maxValue: { valid: false } } : null;
    };
}
