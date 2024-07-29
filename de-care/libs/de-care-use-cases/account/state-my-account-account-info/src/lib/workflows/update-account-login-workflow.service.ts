import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, mapTo, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { UpdateAccountLoginWorkflowService } from '@de-care/domains/account/state-management';
import { patchAccountUsername } from '@de-care/domains/account/state-account';
import { PasswordValidationWorkflowService, PasswordValidationWorkflowError } from '@de-care/domains/customer/state-customer-verification';

export interface UpdateAccountLoginRequest {
    userName: string;
    password: string;
    oldPassword: string;
}

export interface UpdateAccountLoginInfoWorkflowError {
    type: 'PASSWORD_ERROR_POLICY' | 'PASSWORD_ERROR_RESERVED_WORD' | 'SYSTEM';
    reservedWord?: string;
}

@Injectable({ providedIn: 'root' })
export class UpdateAccountLoginInfoWorkflowService implements DataWorkflow<UpdateAccountLoginRequest, boolean> {
    constructor(
        private readonly _updateAccountLoginWorkflowService: UpdateAccountLoginWorkflowService,
        private readonly _store: Store,
        private readonly _passwordValidationWorkflowService: PasswordValidationWorkflowService
    ) {}

    build(request: UpdateAccountLoginRequest): Observable<boolean> {
        const passwordValidate$ = this._passwordValidationWorkflowService.build({ password: request.password }).pipe(
            catchError((error: PasswordValidationWorkflowError) => {
                if (error.type === 'RESERVED_WORD') {
                    return throwError({ type: 'PASSWORD_ERROR_RESERVED_WORD', reservedWord: error.reservedWord } as UpdateAccountLoginInfoWorkflowError);
                }
                return throwError({ type: 'PASSWORD_ERROR_POLICY' } as UpdateAccountLoginInfoWorkflowError);
            })
        );
        return passwordValidate$.pipe(
            concatMap(() =>
                this._updateAccountLoginWorkflowService.build(request).pipe(
                    tap(() => {
                        this._store.dispatch(patchAccountUsername({ userName: request.userName }));
                    }),
                    mapTo(true),
                    catchError(() => {
                        return throwError({ type: 'SYSTEM' } as UpdateAccountLoginInfoWorkflowError);
                    })
                )
            )
        );
    }
}
