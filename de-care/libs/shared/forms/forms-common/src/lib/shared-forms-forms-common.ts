import { Observable, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';

export function wireUpCreditCardNameAutofill(firstName: AbstractControl, lastName: AbstractControl, nameOnCard: AbstractControl, nameOnCardHidden?: boolean): Observable<any> {
    if (nameOnCardHidden) {
        return combineLatest([firstName.valueChanges, lastName.valueChanges]).pipe(
            map(() => {
                if (firstName.valid && lastName.valid) {
                    nameOnCard.patchValue(firstName.value + ' ' + lastName.value);
                }
            })
        );
    } else {
        return combineLatest([firstName.valueChanges, lastName.valueChanges]).pipe(
            takeUntil(nameOnCard.valueChanges),
            map(() => {
                if (firstName.valid && lastName.valid) {
                    nameOnCard.patchValue(firstName.value + ' ' + lastName.value);
                }
            })
        );
    }
}
