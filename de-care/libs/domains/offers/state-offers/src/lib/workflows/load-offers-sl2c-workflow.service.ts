import { DataOffersService, Sl2cOfferRequest } from '../data-services/data-offers.service';
import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError, tap, mapTo } from 'rxjs/operators';
import { loadOffersError, setOffers } from '../state/actions/load-offers.actions';

@Injectable({ providedIn: 'root' })
export class LoadOffersSl2cWorkflowService implements DataWorkflow<Sl2cOfferRequest, boolean> {
    constructor(private _dataOffersService: DataOffersService, private _store: Store) {}

    build(request: Sl2cOfferRequest): Observable<boolean> {
        return this._dataOffersService.getOffers(request).pipe(
            tap(offers => this._store.dispatch(setOffers({ offers }))),
            mapTo(true),
            catchError(error => {
                this._store.dispatch(loadOffersError(error));
                return throwError(error);
            })
        );
    }
}
