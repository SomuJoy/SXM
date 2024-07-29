import { Injectable } from '@angular/core';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { getConfirmationDataForAddSecondRadio } from '../state/public.selectors';

@Injectable({
    providedIn: 'root',
})
export class OrderCompletedForAddSecondRadioWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _store: Store) {}

    build() {
        return this._store.select(getConfirmationDataForAddSecondRadio).pipe(
            map((data) => (!!data.secondDevice || !!data.streamingAccount) && !!data.orderSummary),
            tap((isCompleted) => {
                if (isCompleted) {
                    this._store.dispatch(pageDataFinishedLoading());
                }
            })
        );
    }
}
