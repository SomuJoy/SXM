import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { loadOffersError, setOffers } from '../state/actions/load-offers.actions';
import { DataOffersCustomerCancelService } from '../data-services/data-offers-customer-cancel.service';
import { setLeadOffersIds, setCompatibleOffersIds, setPresentmentTestCell } from '../state/actions/load-presentment-offer-ids.actions';
import { behaviorEventReactionForDigitalSegment } from '@de-care/shared/state-behavior-events';

interface WorkflowRequest {
    subscriptionId: number;
    cancelReason: string;
}

const LEAD_OFFERS = 'LEAD_OFFERS';
const COMPATIBLE_OFFERS = 'COMPATIBLE_OFFERS';

@Injectable({ providedIn: 'root' })
export class LoadCancelOffersWorkflowService implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(private readonly _store: Store, private readonly _dataOffersCustomerCancelService: DataOffersCustomerCancelService) {}

    build({ subscriptionId, cancelReason }: WorkflowRequest): Observable<boolean> {
        return this._dataOffersCustomerCancelService.getCustomerOffers({ subscriptionId, cancelReason }).pipe(
            tap((res) => {
                this._store.dispatch(setOffers({ offers: res.offers }));
                this._store.dispatch(setLeadOffersIds({ ids: this._getPlanCodesByType(res?.presentment, LEAD_OFFERS) }));
                this._store.dispatch(setCompatibleOffersIds({ ids: this._getPlanCodesByType(res?.presentment, COMPATIBLE_OFFERS) }));
                this._store.dispatch(setPresentmentTestCell({ presentmentTestCell: res.presentmentTestCell }));
                this._store.dispatch(behaviorEventReactionForDigitalSegment({ digitalSegment: res.digitalSegment }));
            }),
            catchError((error) => {
                this._store.dispatch(loadOffersError(error));
                return throwError(error);
            }),
            map(() => true)
        );
    }

    private _getPlanCodesByType(arr, typeStr): string[] {
        const typeArr = arr?.filter((item) => item.type === typeStr);
        return typeArr?.length > 0 ? typeArr[0].planCodes : [];
    }
}
