import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { catchError } from 'rxjs/operators';
import { offerToOfferError } from '../state/actions';
import { DataOfferToOfferService } from '../data-services/data-offer-to-offer.service';
import { OfferToOfferResponse, OfferToOfferRequest } from '../data-services/offer-to-offer.interface';

@Injectable({ providedIn: 'root' })
export class OfferToOfferWorkflowService implements DataWorkflow<{ subscriptionId: string; planCode: Array<{ plans: string }> }, OfferToOfferResponse> {
    constructor(private _dataOfferToOfferService: DataOfferToOfferService, private _store: Store) {}

    build(request): Observable<OfferToOfferResponse> {
        return this._dataOfferToOfferService.offerToOffer(request).pipe(
            catchError(error => {
                this._store.dispatch(offerToOfferError({ error }));
                return throwError(error);
            })
        );
    }
}
