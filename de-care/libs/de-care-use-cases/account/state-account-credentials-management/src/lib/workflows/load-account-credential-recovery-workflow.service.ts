import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { UpdateUsecaseWorkflowService } from '@de-care/domains/utility/state-update-usecase';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadAccountCredentialRecoveryWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store, private readonly _updateUsecaseWorkflowService: UpdateUsecaseWorkflowService) {}

    build(useCase): Observable<boolean> {
        this._store.dispatch(pageDataFinishedLoading());
        return this._updateUsecaseWorkflowService.build({ useCase }).pipe(
            map((response) => response?.status),
            map((status) => status),
            catchError(() => of(false))
        );
    }
}
