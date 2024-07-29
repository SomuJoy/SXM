import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ValidateEmailWorkFlowService, ValidateEmailWorkflowStatus } from './workflows/validate-email.workflow';

@Injectable({ providedIn: 'root' })
export class EmailAsyncValidator {
    constructor(private readonly _validateEmailWorkFlowService: ValidateEmailWorkFlowService) {}

    static createValidator(validateEmailWorkFlowService): AsyncValidatorFn {
        return (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
            if (ctrl.value === '' || ctrl.value === null || ctrl.value === undefined) {
                return of(null);
            }

            return validateEmailWorkFlowService.build({ email: ctrl.value }).pipe(
                map(validationStatus => (validationStatus === ValidateEmailWorkflowStatus.fail ? { uniqueEmail: true } : null)),
                catchError(() => of({ uniqueEmail: true }))
            );
        };
    }

    getValidator() {
        return EmailAsyncValidator.createValidator(this._validateEmailWorkFlowService);
    }
}
