import { Injectable } from '@angular/core';
import { RegisterDataModel } from '@de-care/data-services';
import { RegisterWorkflowService } from '@de-care/domains/account/state-account';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, take } from 'rxjs/operators';
import { selectRegistrationDataForSubmission } from '../state/selectors';
import { errorType } from './find-account-by-radio-id-or-vin-workflow.service';

export enum errorCode {
    USER_NAME_ALREADY_IN_IDM
}
@Injectable({ providedIn: 'root' })
export class RegisterAccountWorkflowService implements DataWorkflow<void, boolean> {
    registerRequestData: any;

    constructor(private readonly _store: Store, private _registerWorkflowService: RegisterWorkflowService) {}

    build(): Observable<boolean> {
        return this._store.pipe(
            select(selectRegistrationDataForSubmission),
            take(1),
            concatMap(registrationData => this.onRegisterAccount(registrationData)),
            mapTo(true),
            catchError(error => {
                const errorResponse = error?.error?.error;
                if (errorResponse?.fieldErrors) {
                    if (errorResponse?.fieldErrors[0].errorType === 'SYSTEM' && errorResponse?.fieldErrors[0].errorCode === 'USER_NAME_ALREADY_IN_IDM') {
                        return throwError({ errorCode: errorCode.USER_NAME_ALREADY_IN_IDM });
                    }
                }
                return throwError({ errorCode: errorType.SYSTEM });
            })
        );
    }

    onRegisterAccount(registrationData: RegisterDataModel): any {
        return this._registerWorkflowService.build({ registrationData: registrationData }).pipe(
            map(updated => {
                if (updated.status !== 'SUCCESS') {
                    throw {
                        error: updated
                    };
                }
                return true;
            }),
            catchError(_ => throwError(_))
        );
    }
}
