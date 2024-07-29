import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, timer, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { VerifyPhoneWorkFlowService, VerifyPhoneWorkflowStatus } from './workflows/verify-phone.workflow';

@Injectable({ providedIn: 'root' })
export class PhoneNumberAsyncValidator {
    constructor(private readonly _verifyPhoneWorkFlowService: VerifyPhoneWorkFlowService) {}

    static createValidator(verifyPhoneWorkFlowService: VerifyPhoneWorkFlowService): AsyncValidatorFn {
        return (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
            if (ctrl.value === '' || ctrl.value === null || ctrl.value === undefined) {
                return of(null);
            }

            return timer(250).pipe(
                switchMap(() => verifyPhoneWorkFlowService.build({ phoneNumber: ctrl.value })),
                map(validationStatus => {
                    return validationStatus === VerifyPhoneWorkflowStatus.fail ? { validPhoneNumber: true } : null;
                }),
                catchError(() => {
                    return of({ validPhoneNumber: true });
                })
            );
        };
    }

    getValidator() {
        return PhoneNumberAsyncValidator.createValidator(this._verifyPhoneWorkFlowService);
    }
}
