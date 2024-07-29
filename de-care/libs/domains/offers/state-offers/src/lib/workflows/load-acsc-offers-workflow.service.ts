import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DataACSCOffersService } from '../data-services/data-acsc-offers.service';
import { loadOffersError, setOffers } from '../state/actions/load-offers.actions';
import { behaviorEventReactionAcscOffersFailure } from '@de-care/shared/state-behavior-events';

interface WorkflowRequest {
    trialRadioId: string;
    selfPayRadioId?: string;
    accountConsolidation: boolean;
    programCode?: string;
    marketingPromoCode?: string;
}

@Injectable({ providedIn: 'root' })
export class LoadACSCOffersWorkflowService implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(private readonly _store: Store, private readonly _dataACSCOffersService: DataACSCOffersService) {}

    build(request: WorkflowRequest): Observable<boolean> {
        return this._dataACSCOffersService.getOffers(request).pipe(
            tap((offers) => {
                this._store.dispatch(setOffers({ offers }));
            }),
            catchError((error) => {
                this._store.dispatch(loadOffersError(error));
                const errorCode = error?.error?.error?.errorCode ?? '';
                this._store.dispatch(behaviorEventReactionAcscOffersFailure({ errorMessage: errorCode }));
                return throwError(error);
            }),
            map(() => true)
        );
    }
}
