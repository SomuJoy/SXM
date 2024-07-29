import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { DataOfferRenewalService } from '../data-services/data-offer-renewal.service';
import { OfferRenewalRequest, Offer } from '../data-services/offer-renewal.interface';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError, map, tap } from 'rxjs/operators';
import { loadOfferRenewalError, setOfferRenewal } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class LoadOffersRenewalWorkflowService implements DataWorkflow<OfferRenewalRequest, boolean> {
    constructor(private readonly _dataOfferRenewalService: DataOfferRenewalService, private readonly _store: Store) {}

    build(request: OfferRenewalRequest): Observable<boolean> {
        return this._dataOfferRenewalService.getOfferRenewal(request).pipe(
            tap((offers: Offer[]) => {
                this._store.dispatch(setOfferRenewal({ offers }));
            }),
            catchError(error => {
                this._store.dispatch(loadOfferRenewalError(error));
                return throwError(error);
            }),
            map(() => true)
        );
    }
}
