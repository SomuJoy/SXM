import { takeUntil, tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { AbstractControl } from '@angular/forms';

export function unmaskOnValueChange(control: AbstractControl, pattern, done$?: Observable<boolean>): Subscription {
    return control.valueChanges
        .pipe(
            tap((value) => {
                control.patchValue(value?.replace(pattern, ''), {
                    emitEvent: false,
                    emitModelToViewChange: false,
                });
            }),
            done$ ? takeUntil(done$) : tap()
        )
        .subscribe();
}
