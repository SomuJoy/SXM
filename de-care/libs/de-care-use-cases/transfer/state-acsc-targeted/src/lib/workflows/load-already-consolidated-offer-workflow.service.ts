import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store, select } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, mergeMap, take, mapTo, withLatestFrom, map } from 'rxjs/operators';
import { LoadOffersWorkflowService } from '@de-care/domains/offers/state-offers';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getLoadOffersPayloadForAlreadyConsolidated, getTrialRadioAccountState } from '../state/selectors/state.selectors';
import { getIsCanadaMode, provinceChanged } from '@de-care/domains/customer/state-locale';

interface OfferRequest {
    programCode: string;
    streaming: boolean;
    student: boolean;
    province?: string;
}

@Injectable({ providedIn: 'root' })
export class LoadAlreadyConsolidatedWorkflowService implements DataWorkflow<OfferRequest, string> {
    constructor(private readonly _store: Store, private readonly _loadOffersWorkflowService: LoadOffersWorkflowService) {}

    build(): Observable<string> {
        return this._store.pipe(
            select(getLoadOffersPayloadForAlreadyConsolidated),
            take(1),
            mergeMap((request) => this._loadOffersWorkflowService.build(request).pipe(mapTo(request.programCode))),
            tap(() => this._store.dispatch(pageDataFinishedLoading())),
            withLatestFrom(this._store.pipe(select(getIsCanadaMode)), this._store.pipe(select(getTrialRadioAccountState))),
            map(([response, isCanada, state]) => {
                if (isCanada && state) {
                    this._store.dispatch(provinceChanged({ province: state }));
                }
                return response;
            }),
            catchError((error) => {
                return throwError(error);
            })
        );
    }
}
