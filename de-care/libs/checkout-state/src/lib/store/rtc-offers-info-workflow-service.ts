import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { getRenewalPlanCode } from './rtc.selectors';
import { getActiveOrClosedRadioIdOnAccount, getCheckoutLeadOfferPlanCode } from './selectors';
import { take, withLatestFrom, concatMap, mapTo, tap, catchError } from 'rxjs/operators';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import { getIsCanadaMode } from '@de-care/settings';

@Injectable({ providedIn: 'root' })
export class RtcOffersInfoWorkflow implements DataWorkflow<void, void> {
    constructor(private readonly _store: Store, private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService) {}

    build(): Observable<void> {
        return this._store.pipe(
            select(getRenewalPlanCode),
            take(1),
            withLatestFrom(
                this._store.pipe(select(getCheckoutLeadOfferPlanCode)),
                this._store.pipe(select(getActiveOrClosedRadioIdOnAccount)),
                this._store.pipe(select(getIsCanadaMode))
            ),
            concatMap(([renewalPlanCode, leadPlanCode, radioIdLast4, isCanadaMode]) => {
                return this._loadOffersInfoWorkflowService
                    .build({
                        planCodes: [
                            {
                                leadOfferPlanCode: leadPlanCode,
                                renewalPlanCodes: [renewalPlanCode],
                            },
                        ],
                        radioId: radioIdLast4,
                        province: undefined,
                    })
                    .pipe(mapTo(null));
            })
        );
    }
}
