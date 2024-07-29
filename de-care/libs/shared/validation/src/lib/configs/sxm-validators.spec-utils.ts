import { ValidatorFn } from '@angular/forms';

export function runValidators(value: any, validators: ValidatorFn[]) {
    let result = null;
    for (let i = 0; i < validators.length && result === null; i++) {
        result = validators[i](value);
    }
    return result;
}
