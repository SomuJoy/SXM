import { Injectable } from '@angular/core';
import { LoadOffersCustomerWorkflowService } from '@de-care/domains/offers/state-offers';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { mapTo, take, concatMap, withLatestFrom } from 'rxjs/operators';
import { getCanadaProvince } from '../state/selectors';
import { Store, select } from '@ngrx/store';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';

@Injectable({ providedIn: 'root' })
export class LoadRTDCustomerOfferWorkflowService implements DataWorkflow<void, boolean> {
    constructor(private readonly _loadOffersCustomerWorkflowService: LoadOffersCustomerWorkflowService, private readonly _store: Store) {}

    build(): Observable<boolean> {
        return this._store.pipe(
            select(getCanadaProvince),
            withLatestFrom(this._store.select(getNormalizedQueryParams)),
            concatMap(([province, { programcode, promocode }]) =>
                this._loadOffersCustomerWorkflowService
                    .build({
                        retrieveFallbackOffer: false,
                        student: false,
                        streaming: true,
                        ...(programcode && { programCode: programcode }),
                        ...(province && { province }),
                        ...(promocode && { marketingPromoCode: promocode })
                    })
                    .pipe(mapTo(true))
            )
        );
    }
}
