import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { DataChangeOffersService } from '../data-services/data-change-offers.service';
import { Store } from '@ngrx/store';
import { catchError, map, tap } from 'rxjs/operators';
import { loadOffersError, setOffers } from '../state/actions/load-offers.actions';

export type ChangeSubscriptionOffersError = 'ALREADY_UPGRADED' | 'NON_ELEGIBLE' | 'NON_ELEGIBLE_REDIRECT' | 'OTHER' | 'NONE';

@Injectable({ providedIn: 'root' })
export class LoadChangeSubscriptionOffersWorkflowService implements DataWorkflow<{ subscriptionId: number; task?: string }, boolean> {
    constructor(private _dataChangeOffersService: DataChangeOffersService, private _store: Store) {}

    build(request: { subscriptionId: number; task?: string; marketingPromoCode?: string }): Observable<boolean> {
        return this._dataChangeOffersService.getCustomerChangeOffers(request, false).pipe(
            tap((offers) => this._store.dispatch(setOffers({ offers }))),
            catchError((error) => {
                this._store.dispatch(loadOffersError(error));
                let changeSubscriptionOffersError: ChangeSubscriptionOffersError = 'OTHER';
                if (error.status === 412) {
                    const propCode = error.error.error.errorPropKey;
                    if (propCode === 'offer.service.plan.not.eligible.for.upgrade') {
                        changeSubscriptionOffersError = 'NON_ELEGIBLE';
                    } else if (propCode === 'offer.service.plan.already.upgraded') {
                        changeSubscriptionOffersError = 'ALREADY_UPGRADED';
                    } else if (propCode === 'offer.service.plan.not.supported') {
                        changeSubscriptionOffersError = 'NON_ELEGIBLE_REDIRECT';
                    }
                }
                return throwError(changeSubscriptionOffersError);
            }),
            map(() => true)
        );
    }
}
