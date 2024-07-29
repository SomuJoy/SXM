import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';

@Injectable({ providedIn: 'root' })
export class LoadCreatePasswordConfirmationDataWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store) {}

    build(): Observable<boolean> {
        this._store.dispatch(pageDataFinishedLoading());
        return of(true);
    }
}
