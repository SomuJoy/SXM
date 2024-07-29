import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { DataOffersService, OfferRenewalRequestModel } from '../data-services/data-offers.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { loadRenewalOffersError, setRenewalOffers } from '../state/actions/load-renewal-offers.actions';
import { Store } from '@ngrx/store';
import { behaviorEventReactionRenewalPlansPresented } from '@de-care/shared/state-behavior-events';
import { getOffersPlanCodeAndPrice } from '../data-services/helpers';

@Injectable({ providedIn: 'root' })
export class LoadRenewalOffersWorkflowService implements DataWorkflow<OfferRenewalRequestModel, boolean> {
    constructor(private readonly _dataOffersService: DataOffersService, private readonly _store: Store) {}

    build(request: OfferRenewalRequestModel): Observable<boolean> {
        return this._dataOffersService.getOfferRenewal(request).pipe(
            tap(renewalOffers => this._store.dispatch(setRenewalOffers({ renewalOffers }))),
            tap(renewalOffers => this._store.dispatch(behaviorEventReactionRenewalPlansPresented({ presented: getOffersPlanCodeAndPrice(renewalOffers) }))),
            catchError(error => {
                this._store.dispatch(loadRenewalOffersError(error));
                return throwError(error);
            }),
            map(() => true)
        );
    }
}
