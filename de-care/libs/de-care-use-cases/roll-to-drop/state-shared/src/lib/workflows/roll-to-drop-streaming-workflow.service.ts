import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of } from 'rxjs';
import { concatMap, withLatestFrom, filter, take, mapTo, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { ValidatePromoCodeWorkflowService } from '@de-care/domains/offers/state-promo-code';
import { LoadAccountSessionInfoWorkflowService } from '@de-care/domains/account/state-session-data';
import { setLangPref, setProgramCode, setPromoCode } from '../state/actions';
import { getOfferDataWithStreaming } from '../state/selectors';
import { LoadRtdStreamingData } from './load-rtd-streaming-data-workflow.service';
import { resetOffersStateToInitial } from '@de-care/domains/offers/state-offers';
import { resetOffersInfoStateToInitial } from '@de-care/domains/offers/state-offers-info';
import { behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';

export interface RTDStreamingWorkflowInput {
    programCode: string;
    langPref: string;
    promoCode: string;
    dataFromRFLZ: any;
}

export enum RTDStreamingWorkflowStatusEnum {
    offerNotAvailable = 'offerNotAvailable',
    offerNotAvailableAfterLoadingRTD = 'offerNotAvailableAfterLoadingRTD',
    offerAvailable = 'offerAvailable',
    tokenInvalidOrNotAvailable = 'tokenInvalidOrNotAvailable',
    promoCodeOrProgramCodeInvalid = 'promoCodeOrProgramCodeInvalid',
}

@Injectable({
    providedIn: 'root',
})
export class RollToDropStreamingWorkflowService implements DataWorkflow<RTDStreamingWorkflowInput, RTDStreamingWorkflowStatusEnum> {
    constructor(
        private readonly _loadRTDStreamingData: LoadRtdStreamingData,
        private readonly _validatePromoCodeWorkflowService: ValidatePromoCodeWorkflowService,
        private readonly _loadAccountSessionInfoWorkflowService: LoadAccountSessionInfoWorkflowService,
        private readonly _store: Store
    ) {}

    build(input: RTDStreamingWorkflowInput) {
        this._store.dispatch(
            behaviorEventReactionFeatureTransactionStarted({
                flowName: 'streaming',
            })
        );
        if (!input?.promoCode && !input.programCode) {
            return of(RTDStreamingWorkflowStatusEnum.promoCodeOrProgramCodeInvalid);
        }
        if (input.promoCode === '') {
            return of(RTDStreamingWorkflowStatusEnum.offerNotAvailable);
        }
        return this._validatePromoCodeWorkflowService
            .build({ marketingPromoCode: input.promoCode, streaming: true })
            .pipe(
                concatMap((data) =>
                    !data || this._isValidPromoCode(input.promoCode, data.status)
                        ? this._loadStreamingData(this._handleProgramCode(input.programCode), input.promoCode, input.langPref, input.dataFromRFLZ)
                        : of(RTDStreamingWorkflowStatusEnum.promoCodeOrProgramCodeInvalid)
                )
            );
    }

    private _isValidPromoCode(promoCode: string, status: string): boolean {
        if (status === 'INVALID' || status === 'REDEEMED') {
            return false;
        }

        if (status === 'VALID') {
            this._store.dispatch(setPromoCode({ promoCode: promoCode }));
        }

        return true;
    }

    private _loadStreamingData(processedProgramCode: string, promoCode: string, langPref: string, dataFromRFLZ: any): Observable<RTDStreamingWorkflowStatusEnum> {
        return this._loadRTDStreamingData
            .build({ ...(processedProgramCode !== 'INVALID' && { programCode: processedProgramCode }), ...(!!promoCode && { marketingPromoCode: promoCode }) })
            .pipe(
                withLatestFrom(this._store.pipe(select(getOfferDataWithStreaming))),
                filter(([_, offerData]) => !!offerData.offer),
                take(1),
                concatMap(([_, offerData]) =>
                    offerData?.offer?.fallback
                        ? this._handleInvalidPromoOrProgramCode()
                        : of(RTDStreamingWorkflowStatusEnum.offerAvailable).pipe(
                              tap(() => {
                                  this._store.dispatch(setLangPref({ langPref: langPref }));

                                  if (processedProgramCode !== 'INVALID') {
                                      this._store.dispatch(setProgramCode({ programCode: processedProgramCode }));
                                  }
                              }),
                              concatMap((status) => (dataFromRFLZ === 'e' ? this._loadAccountSessionInfoWorkflowService.build().pipe(mapTo(status)) : of(status)))
                          )
                )
            );
    }

    private _handleInvalidPromoOrProgramCode(): Observable<RTDStreamingWorkflowStatusEnum> {
        this._store.dispatch(resetOffersStateToInitial());
        this._store.dispatch(resetOffersInfoStateToInitial());
        return of(RTDStreamingWorkflowStatusEnum.promoCodeOrProgramCodeInvalid);
    }

    private _handleProgramCode(code: string): string {
        return !!code && code !== '' ? code : 'INVALID';
    }
}
