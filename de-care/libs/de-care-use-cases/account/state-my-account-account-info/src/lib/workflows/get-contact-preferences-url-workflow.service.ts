import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { GetContactPreferencesWorkflowService } from '@de-care/domains/account/state-management';

export interface GetContactPreferencesUrlRequest {
    langPref: string;
}

@Injectable({ providedIn: 'root' })
export class GetContactPreferencesUrlWorkflowService implements DataWorkflow<GetContactPreferencesUrlRequest, boolean> {
    constructor(private readonly _getContactPreferencesWorkflowService: GetContactPreferencesWorkflowService, private readonly _store: Store) {}

    build(request: GetContactPreferencesUrlRequest): Observable<boolean> {
        return this._getContactPreferencesWorkflowService.build(request).pipe(
            catchError((error) => {
                return throwError({ error });
            })
        );
    }
}
