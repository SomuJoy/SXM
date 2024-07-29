import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { clearFlepzData } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class LoadFindAccountExperienceService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store) {}

    build(): Observable<boolean> {
        this._store.dispatch(clearFlepzData());
        this._store.dispatch(pageDataFinishedLoading());
        return of(true);
    }
}
