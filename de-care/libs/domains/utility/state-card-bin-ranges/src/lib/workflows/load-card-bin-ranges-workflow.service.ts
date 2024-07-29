import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DataCardBinRangesService } from '../data-services/data-card-bin-ranges.service';
import { loadCardBinRangesError, setCardBinRanges } from '../state/actions';

export type LoadCardBinRangesWorkflowErrors = 'SYSTEM';

export interface CardBinRange {
    name: string;
    type: string;
    priority: number;
    regex: string;
}

@Injectable({ providedIn: 'root' })
export class LoadCardBinRangesWorkflowService implements DataWorkflow<void, CardBinRange[]> {
    constructor(private readonly _dataCardBinRangesService: DataCardBinRangesService, private readonly _store: Store) {}

    build(): Observable<CardBinRange[]> {
        return this._dataCardBinRangesService.getCardBinRanges().pipe(
            tap((cardBinRanges) => {
                this._store.dispatch(setCardBinRanges({ cardBinRanges }));
            }),
            catchError((error) => {
                this._store.dispatch(loadCardBinRangesError({ error }));
                return throwError('SYSTEM' as LoadCardBinRangesWorkflowErrors);
            })
        );
    }
}
