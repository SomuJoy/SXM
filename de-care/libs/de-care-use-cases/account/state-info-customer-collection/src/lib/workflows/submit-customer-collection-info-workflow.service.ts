import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { DataPublishWorkflowService } from '@de-care/domains/account/state-branded-data-collection';
import { catchError, concatMap, mapTo, take } from 'rxjs/operators';
import { getChatDetailsForRequest } from '../state/public.selectors';

@Injectable({ providedIn: 'root' })
export class SubmitCustomerCollectionInfo implements DataWorkflow<{ name: string; value: string | number }[], boolean> {
    constructor(private readonly _dataPublishWorkflowService: DataPublishWorkflowService, private readonly _store: Store) {}

    build(contextVariables): Observable<boolean> {
        return this._store.select(getChatDetailsForRequest).pipe(
            take(1),
            concatMap((details) => this._dataPublishWorkflowService.build({ ...details, contextVariables, message: 'webrequest' })),
            mapTo(true),
            catchError((error) => this._errorHandler(error))
        );
    }

    private _errorHandler(error) {
        // TODO: Add additional error handler for customer collection info submission
        return throwError(error);
    }
}
