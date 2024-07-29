import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { LoadOffersCustomerWorkflowService, getOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { Observable } from 'rxjs';
import { concatMap, take, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { getPromoCodeAndProgramCode, TrialCheckNucaptchaRequiredWorkflowService, getProvinceCodeIfCanadaMode } from '@de-care/de-care-use-cases/roll-to-drop/state-shared';

interface CustomerWorkflowRequestModel {
    province?: string;
    streaming: boolean;
    student?: boolean;
    subscriptionId?: number;
    marketingPromoCode?: string;
    programCode?: string;
}
@Injectable({ providedIn: 'root' })
export class LoadRtdOffersForCustomerWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _loadOffersCustomerWorkflowService: LoadOffersCustomerWorkflowService,
        private readonly _store: Store,
        private readonly _trialCheckNucaptchaRequiredWorkflowService: TrialCheckNucaptchaRequiredWorkflowService
    ) {}

    build(): Observable<boolean> {
        return this._store.pipe(
            select(getPromoCodeAndProgramCode),
            withLatestFrom(this._store.pipe(select(getOfferPlanCode)), this._store.pipe(select(getProvinceCodeIfCanadaMode))),
            take(1),
            concatMap(([{ promoCode, programCode }, planCode, provinceCode]) => {
                const offersRequest: CustomerWorkflowRequestModel = {
                    streaming: true,
                    student: false,
                    subscriptionId: null,
                    ...(provinceCode && { province: provinceCode }),
                    ...(promoCode && { marketingPromoCode: promoCode }),
                    ...(programCode && { programCode }),
                };
                return this._loadOffersCustomerWorkflowService.build(offersRequest).pipe(concatMap(() => this._trialCheckNucaptchaRequiredWorkflowService.build(planCode)));
            })
        );
    }
}
