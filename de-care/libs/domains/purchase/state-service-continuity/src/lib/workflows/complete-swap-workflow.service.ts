import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataSwapRadioService, SwapRadioRequest, SwapRadioResponse } from '../data-services/data-swap-radio.service';

export type CompleteSwapWorkflowServiceError = 'CREDIT_CARD_FAILURE' | 'SYSTEM';

@Injectable({ providedIn: 'root' })
export class CompleteSwapWorkflowService implements DataWorkflow<SwapRadioRequest, SwapRadioResponse> {
    constructor(private _dataSwapService: DataSwapRadioService) {}

    build(request: SwapRadioRequest): Observable<SwapRadioResponse> {
        return this._dataSwapService.swap(request).pipe(
            catchError((error) => {
                if (this._isCCError(error?.errorPropKey)) {
                    return throwError('CREDIT_CARD_FAILURE' as CompleteSwapWorkflowServiceError);
                }
                return throwError(error);
            })
        );
    }

    private _isCCError(errorPropKey: string) {
        const ccErrorKeys = Object.freeze([
            'error.purchase.service.credit.card.validation.failed',
            'error.purchase.service.paymentinfo.required.paymentInfo',
            'error.purchase.service.no.creditcard.on.account',
            'error.purchase.service.ccinfo.required.cardInfo',
            'error.purchase.service.creditcard.fraud.reject',
        ]);
        return ccErrorKeys.indexOf(errorPropKey) > -1;
    }
}
