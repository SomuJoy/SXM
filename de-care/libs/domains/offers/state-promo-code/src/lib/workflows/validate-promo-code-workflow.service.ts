import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PromoCodeValidateResponse } from '../dataservices/promo-code.interface';
import { PromoCodeService } from '../dataservices/promo-code.service';
import { behaviorEventErrorFromHttpCall } from '@de-care/shared/state-behavior-events';

export type ProcessResultStatus = 'VALID' | 'INVALID' | 'REDEEMED' | 'EXPIRED';
export type ProcessResultErrorCodes = 'ALREADY_REDEEMED' | 'NOT_FOUND' | 'INVALID_PREFIX' | 'OUTSIDE_START_AND_END_DATE' | 'INELIGIBLE_PROMO_CODE';

export interface ValidatePromoCodeWorkflowServiceParams {
    marketingPromoCode: string;
    streaming: boolean;
}
@Injectable({ providedIn: 'root' })
export class ValidatePromoCodeWorkflowService implements DataWorkflow<ValidatePromoCodeWorkflowServiceParams, PromoCodeValidateResponse | ProcessResultStatus> {
    constructor(private readonly _store: Store, private readonly _promoCodeService: PromoCodeService) {}

    build(params: ValidatePromoCodeWorkflowServiceParams) {
        if (!params.marketingPromoCode) {
            return of(null);
        }
        return this._promoCodeService.validatePromoCode(params, false).pipe(
            map((resp: PromoCodeValidateResponse) => {
                return { ...resp, status: 'VALID' };
            }),
            catchError((response) => {
                const errorPropKey = response?.error?.error?.fieldErrors?.[0]?.errorPropKey;
                const errorCode = response?.error?.error?.fieldErrors?.[0]?.errorCode;
                let status: ProcessResultStatus;
                if (errorCode === 'ALREADY_REDEEMED' || errorPropKey === 'error.code.promo.code.service.already') {
                    status = 'REDEEMED';
                } else if (errorCode === 'OUTSIDE_START_AND_END_DATE') {
                    status = 'EXPIRED';
                } else {
                    status = 'INVALID';
                }
                this._store.dispatch(behaviorEventErrorFromHttpCall({ error: response }));
                return of({ status });
            })
        );
    }
}
