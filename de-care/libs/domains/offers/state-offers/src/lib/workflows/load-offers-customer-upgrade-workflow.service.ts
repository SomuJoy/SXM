import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DataOffersCustomerUpgradeService } from '../data-services/data-offers-customer-upgrade.service';
import { Offer } from '../data-services/offer.interface';
import { setOffers } from '../state/actions/load-offers.actions';

interface LoadOffersCustomerUpgradeWorkflowRequest {
    subscriptionId: string;
}
interface LoadOffersCustomerUpgradeWorkflowResponse {
    offers: Offer[];
    presentment: string;
    digitalSegment: string;
}

@Injectable({ providedIn: 'root' })
export class LoadOffersCustomerUpgradeWorkflowService implements DataWorkflow<LoadOffersCustomerUpgradeWorkflowRequest, LoadOffersCustomerUpgradeWorkflowResponse> {
    constructor(private readonly _store: Store, private readonly _dataOffersCustomerUpgradeService: DataOffersCustomerUpgradeService) {}

    build(request: LoadOffersCustomerUpgradeWorkflowRequest): Observable<LoadOffersCustomerUpgradeWorkflowResponse> {
        return this._dataOffersCustomerUpgradeService.getCustomerUpgradeOffers(request).pipe(
            tap((response) => {
                // TODO: Add any behavior tracking needed here

                // TODO: will need to eventually save offers indexed by subscription id
                this._store.dispatch(setOffers({ offers: response.offers }));
            }),
            catchError((error) => {
                // TODO: add error types from MS
                return throwError(error);
            })
        );
    }
}
