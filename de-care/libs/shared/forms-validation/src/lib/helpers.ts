import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function runValidatorSetAndGetFirstError(validators: ValidatorFn[], control: AbstractControl): ValidationErrors | null {
    return validators.reduce((error, validator) => error || validator(control), null);
}

export function numberOfErrorsInValidatorSet(validators: ValidatorFn[], control: AbstractControl): number {
    return validators.reduce((count, validator) => {
        if (validator(control)) {
            return count + 1;
        }
        return count;
    }, 0);
}

export function atLeastOneNullInValidatorSet(validators: ValidatorFn[], control: AbstractControl): boolean {
    return validators.reduce((nullResultFound, validator) => {
        return nullResultFound ? nullResultFound : !validator(control);
    }, false);
}

export function getCurrentDateMonthYear(): { month: number; year: number } {
    const dateObj = new Date();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return { month, year };
}
