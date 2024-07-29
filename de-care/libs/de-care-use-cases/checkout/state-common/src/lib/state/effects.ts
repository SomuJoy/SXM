import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CREDIT_CARD_TYPE_IDENTIFIER, CreditCardTypeIdentifier } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import {
    clearPaymentInfo,
    setPaymentInfo,
    initTransactionId,
    newTransactionIdDueToCreditCardError,
    hidePageLoader,
    loadUpsellsForCheckoutIfNeeded,
    resetSelectedPlanCodeToLeadOffer,
    setSelectedPlanCode,
    loadUpsellsForSatelitteTargetedCheckoutIfNeeded,
} from './public.actions';
import { catchError, flatMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
    clearPaymentMethodUseCardOnFile,
    collectAllInboundQueryParams,
    setPaymentInfoWithCardType,
    setPaymentMethodUseCardOnFile,
    setTransactionIdForSession,
} from './actions';
import { behaviorEventReactionForProgramCode, behaviorEventReactionForTransactionId } from '@de-care/shared/state-behavior-events';
import * as uuid from 'uuid/v4';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { Store } from '@ngrx/store';
import { getPayloadForStreamingToSatelliteUpsellsLoad, getPayloadForUpsellsLoad } from './selectors';
import { loadUpsellOffersWithCms, LoadUpsellsWithCmsContentWorkflowService } from '@de-care/domains/offers/state-upsells-with-cms';
import { TranslationSettingsToken, TRANSLATION_SETTINGS, CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { getConfiguredLeadOfferOrFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(
        private readonly _actions$: Actions,
        @Inject(CREDIT_CARD_TYPE_IDENTIFIER) private readonly _creditCardTypeIdentifierService: CreditCardTypeIdentifier,
        private readonly _store: Store,
        @Inject(TRANSLATION_SETTINGS) private readonly _translationSettings: TranslationSettingsToken,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken,
        private readonly _loadUpsellsWithCmsContentWorkflowService: LoadUpsellsWithCmsContentWorkflowService
    ) {}

    initTransactionId$ = createEffect(() =>
        this._actions$.pipe(
            ofType(initTransactionId),
            flatMap(() => {
                const transactionIdForSession = `OAC-${uuid()}`;
                return [setTransactionIdForSession({ transactionIdForSession }), behaviorEventReactionForTransactionId({ transactionId: transactionIdForSession })];
            })
        )
    );

    newTransactionIdDueToCreditCardError$ = createEffect(() =>
        this._actions$.pipe(
            ofType(newTransactionIdDueToCreditCardError),
            map(() => initTransactionId())
        )
    );

    captureProgramCode$ = createEffect(() =>
        this._actions$.pipe(
            ofType(collectAllInboundQueryParams),
            map(({ inboundQueryParams }) =>
                inboundQueryParams?.programcode ? behaviorEventReactionForProgramCode({ programCode: inboundQueryParams.programcode }) : { type: 'noop' }
            )
        )
    );

    creditCardType$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setPaymentInfo),
            flatMap(({ useCardOnFile, paymentInfo }) => {
                if (useCardOnFile) {
                    return [clearPaymentInfo(), setPaymentMethodUseCardOnFile()];
                } else {
                    if (paymentInfo?.cardNumber) {
                        const cardTypeInfo = this._creditCardTypeIdentifierService.identifyType(paymentInfo.cardNumber.toString());
                        return [clearPaymentMethodUseCardOnFile(), setPaymentInfoWithCardType({ paymentInfo: { ...paymentInfo, cardType: cardTypeInfo?.type } })];
                    } else {
                        return [clearPaymentMethodUseCardOnFile(), setPaymentInfoWithCardType({ paymentInfo: { ...paymentInfo, cardType: null } })];
                    }
                }
            })
        )
    );

    loadUpsells$ = createEffect(() =>
        this._actions$.pipe(
            ofType(loadUpsellsForCheckoutIfNeeded),
            withLatestFrom(this._store.select(getPayloadForUpsellsLoad)),
            map(([{ forStreaming }, request]) => {
                return request
                    ? loadUpsellOffersWithCms({
                          upsellsRequest: {
                              ...request,
                              streaming: forStreaming,
                              locales: this._translationSettings.languagesSupported,
                              country: this._countrySettings.countryCode,
                          },
                      })
                    : { type: 'noop' };
            })
        )
    );

    loadSatelliteTargetedUpsells$ = createEffect(() =>
        this._actions$.pipe(
            ofType(loadUpsellsForSatelitteTargetedCheckoutIfNeeded),
            withLatestFrom(this._store.select(getPayloadForUpsellsLoad)),
            map(([{ radioId }, request]) => {
                return request
                    ? loadUpsellOffersWithCms({
                          upsellsRequest: {
                              ...request,
                              radioId,
                              locales: this._translationSettings.languagesSupported,
                              country: this._countrySettings.countryCode,
                          },
                      })
                    : { type: 'noop' };
            })
        )
    );

    resetSelectedPlanCodeToLeadOffer$ = createEffect(() =>
        this._actions$.pipe(
            ofType(resetSelectedPlanCodeToLeadOffer),
            withLatestFrom(this._store.select(getConfiguredLeadOfferOrFirstOfferPlanCode)),
            map(([, planCode]) => setSelectedPlanCode({ planCode }))
        )
    );

    hidePageLoader$ = createEffect(() =>
        this._actions$.pipe(
            ofType(hidePageLoader),
            map(() => pageDataFinishedLoading())
        )
    );
}
