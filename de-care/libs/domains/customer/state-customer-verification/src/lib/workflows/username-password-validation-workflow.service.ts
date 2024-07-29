import { catchError, concatMap, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { UserNamePasswordValidatePayload } from '../data-services/customer-validation.interface';
import { PasswordValidationWorkflowError, PasswordValidationWorkflowService } from './password-validation-workflow.service';
import { UserNameValidationWorkFlow } from './user-name-validation-workflow.service';

export interface UserNameAndPasswordValidationWorkFlowError {
    type: 'EMAIL_ERROR_IN_USE' | 'EMAIL_ERROR_INVALID' | 'PASSWORD_ERROR_POLICY' | 'PASSWORD_ERROR_RESERVED_WORD' | 'SYSTEM';
    reservedWord?: string;
}

@Injectable({ providedIn: 'root' })
export class UserNameAndPasswordValidationWorkFlow implements DataWorkflow<UserNamePasswordValidatePayload, boolean> {
    constructor(
        private readonly _userNameValidationWorkFlow: UserNameValidationWorkFlow,
        private readonly _passwordValidationWorkflowService: PasswordValidationWorkflowService
    ) {}

    build({ userName, password }: UserNamePasswordValidatePayload): Observable<boolean> {
        const passwordValidate$ = this._passwordValidationWorkflowService.build({ password }).pipe(
            catchError((error: PasswordValidationWorkflowError) => {
                if (error.type === 'RESERVED_WORD') {
                    return throwError({ type: 'PASSWORD_ERROR_RESERVED_WORD', reservedWord: error.reservedWord } as UserNameAndPasswordValidationWorkFlowError);
                }
                return throwError({ type: 'PASSWORD_ERROR_POLICY' } as UserNameAndPasswordValidationWorkFlowError);
            })
        );

        return passwordValidate$.pipe(
            concatMap(() =>
                this._userNameValidationWorkFlow.build({ reuseUserName: true, userName }).pipe(
                    map((response) => {
                        if (response) {
                            return true;
                        } else {
                            throw { type: 'EMAIL_ERROR_IN_USE' } as UserNameAndPasswordValidationWorkFlowError;
                        }
                    })
                )
            )
        );
    }
}
