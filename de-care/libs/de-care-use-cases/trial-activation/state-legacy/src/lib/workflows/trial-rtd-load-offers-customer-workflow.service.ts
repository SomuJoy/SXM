import { Injectable } from '@angular/core';
import { CustomerTypeEnum } from '@de-care/domains/account/state-account';
import { Offer, selectOffer } from '@de-care/domains/offers/state-offers';
import { LoadCustomerOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import {
    behaviorEventReactionCustomerInfoAuthenticationType,
    behaviorEventReactionDeviceInfoEsn,
    behaviorEventReactionForCustomerType
} from '@de-care/shared/state-behavior-events';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { LegacyCheckNucaptchaRequiredWorkflowService } from './legacy-check-nu-captcha-required-workflow.service';

interface WorkflowParams {
    usedCarBrandingType: string;
    radioId: string;
    programCode?: string;
}

@Injectable({
    providedIn: 'root'
})
export class TrialRtdLoadOffersCustomerWorkflowService implements DataWorkflow<WorkflowParams, { radioId: string; offer: Offer; displayNucaptcha: boolean }> {
    constructor(
        private readonly _loadCustomerOffersWithCmsContent: LoadCustomerOffersWithCmsContent,
        private _legacyCheckNucaptchaRequiredWorkflowService: LegacyCheckNucaptchaRequiredWorkflowService,
        private readonly _store: Store
    ) {}

    build({ usedCarBrandingType, radioId, programCode }: WorkflowParams) {
        return this._loadCustomerOffersWithCmsContent.build({ usedCarBrandingType, radioId, ...(!!programCode && { programCode }), streaming: false }).pipe(
            withLatestFrom(this._store.pipe(select(selectOffer))),
            switchMap(([_, offer]) => {
                if (offer) {
                    return this._legacyCheckNucaptchaRequiredWorkflowService.build(offer.planCode).pipe(
                        map(displayNucaptcha => {
                            return { radioId, offer, displayNucaptcha };
                        })
                    );
                }
                return of({ radioId, offer: null, displayNucaptcha: false });
            }),
            tap(() => {
                this._store.dispatch(behaviorEventReactionDeviceInfoEsn({ esn: radioId }));
                this._store.dispatch(behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'RFLZ' }));
                this._store.dispatch(behaviorEventReactionForCustomerType({ customerType: CustomerTypeEnum.TrialActivation }));
            })
        );
    }
}
