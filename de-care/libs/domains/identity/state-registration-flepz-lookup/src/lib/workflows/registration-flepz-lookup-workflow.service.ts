import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DataRegistrationFlepzService } from '../data-services/data-registration-flepz.service';
import { setRegistrationFlepzLookupAccounts } from '../state/actions';

export interface RegistrationFlepzLookupWorkflowServiceRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: number | string;
    zipCode: string;
}

export type RegistrationFlepzLookupWorkflowServiceErrors = 'SYSTEM' | 'INVALID_PHONE_NUMBER';

@Injectable({ providedIn: 'root' })
export class RegistrationFlepzLookupWorkflowService implements DataWorkflow<RegistrationFlepzLookupWorkflowServiceRequest, boolean> {
    constructor(private readonly _dataRegistrationFlepzService: DataRegistrationFlepzService, private readonly _store: Store) {}

    build(request: RegistrationFlepzLookupWorkflowServiceRequest): Observable<boolean> {
        return this._dataRegistrationFlepzService.flepzLookup(request).pipe(
            catchError(({ fieldErrors }) => {
                if (fieldErrors?.[0]?.errorCode?.toUpperCase() === 'PHONE_INVALID') {
                    return throwError('INVALID_PHONE_NUMBER' as RegistrationFlepzLookupWorkflowServiceErrors);
                }
                return throwError('SYSTEM' as RegistrationFlepzLookupWorkflowServiceErrors);
            }),
            tap((accounts) => {
                this._store.dispatch(setRegistrationFlepzLookupAccounts({ accounts }));
            }),
            map(() => true)
        );
    }
}
