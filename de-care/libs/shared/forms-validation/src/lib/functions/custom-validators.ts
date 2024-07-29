import { AbstractControl } from '@angular/forms';

const visaRegExPattern = /^4[0-9]{12}(?:[0-9]{3})?$/;
const masterCardRegExPattern = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/;
const amexRegExPattern = /^3[47][0-9]{13}$/;
const dinersClubRegExPattern = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/;
const discoverRegExPattern = /^6(?:011|5[0-9]{2})[0-9]{12}$/;
const jbcRegExPattern = /^(?:2131|1800|35\d{3})\d{11}$/;
/* tslint:disable */
const unionPayRegExPattern =
    /^81[0-6][0-9]{13}$|^817[0-1][0-9]{12}$|^621094[0-9]{10}$|^62[4-6][0-9]{13}$|^628[2-8][0-9]{12}$|^62292[6-9][0-9]{10}$|^6229[3-9][0-9]{11}$|^623[0-6][0-9]{12}$|^6237[0-8][0-9]{11}$|^62379[0-6][0-9]{10}$/;
const flaggedSecurityCodeValidators = /^(?=.*(CVV|CAV|CVC|CID|SecurityID|SecurityCode|Security\#))(?=.*([0-9]{3,})).+/i;
const radioIdLike = /^([A-Za-z0-9]{8}|[A-Za-z0-9]{10}|[A-Za-z0-9]{12}|[0-9A-Za-z]{4}-[0-9A-Za-z]{4}-[0-9A-Za-z]{4})$/;
const vinLike = /^[A-Za-z0-9]{17}$/;

export function atLeastTwoWordsValidator(control: AbstractControl): null | Object {
    // If there is a value and there is no space then it is invalid
    return control.value && control.value.trim().indexOf(' ') === -1 ? { atLeastTwoWords: true } : null;
}

const containsCreditCardInfoPattern = /\D*(?:\d\D*){13,}/;
export function containsCreditCardInfoValidator(control: AbstractControl): null | Object {
    return containsCreditCardInfoPattern.test(control.value) ? { containsCCInfo: true } : null;
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

export function cvvExclusionValidator(control: AbstractControl): null | Object {
    return flaggedSecurityCodeValidators.test(control.value) ? { cvvExclusion: true } : null;
}

export function radioIdOrVinValidator(control: AbstractControl): null | Object {
    const trimmedValue = control?.value?.trim();

    if (!trimmedValue || !(radioIdLike.test(trimmedValue) || vinLike.test(trimmedValue))) {
        return { invalidRadioIdOrVin: true };
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

export function controlIsInvalid(customValidation: (control: AbstractControl) => boolean = () => true): (control: AbstractControl) => boolean {
    return (control: AbstractControl): boolean => {
        if (!!control) {
            return control.invalid && (control.dirty || control.touched || customValidation(control));
        }
        return true;
    };
}
