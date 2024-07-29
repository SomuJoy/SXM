import { Injectable } from '@angular/core';
import {
    getIpToLocationInfo,
    getSelectedProvince,
    provinceChanged,
    setProvinceSelectionDisabled,
    setProvinceSelectionVisibleIfCanada,
} from '@de-care/domains/customer/state-locale';
import { getAllOffersAsArray, LoadOffersCustomerWorkflowService } from '@de-care/domains/offers/state-offers';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { concatMap, filter, flatMap, map, mapTo, pairwise, withLatestFrom } from 'rxjs/operators';
import {
    loadCustomerOffersOnProvinceChange,
    newTransactionIdDueToCreditCardError,
    resetCreateAccountError,
    saveCreateAccountFormData,
    setCreateAccountStepCompleted,
    setProvinceFromIpLocationInfo,
    setProvinceSelectorDisabled,
    setProvinceSelectorEnabled,
    setProvinceSelectorVisibleForCanada,
    setSelectedLeadOfferByPackageName,
    setSelectedLeadOfferPlanCode,
    setTransactionId,
} from './actions';
import { getOffersCustomerRequest } from './selectors';
import { TrialActivationRTPCheckNucaptchaRequiredWorkflowService } from '../workflows/trial-activation-rtp-check-nucaptcha-required-workflow.service';
import { behaviorEventReactionForTransactionId } from '@de-care/shared/state-behavior-events';
import * as uuid from 'uuid/v4';

const isProvinceChangedToOrFromQuebec = (previousProvince: string, currentProvince: string) => (previousProvince === 'QC') !== (currentProvince === 'QC');

@Injectable({ providedIn: 'root' })
export class TrialActivationRTPEffects {
    constructor(
        private readonly _actions$: Actions,
        private readonly _store: Store,
        private readonly _loadCustomerOffersWorkflow: LoadOffersCustomerWorkflowService,
        private readonly _trialActivationRtpCheckNucaptchaRequiredWorkflowService: TrialActivationRTPCheckNucaptchaRequiredWorkflowService
    ) {}

    submitCreateAccountForm$ = createEffect(() =>
        this._actions$.pipe(
            ofType(saveCreateAccountFormData),
            concatMap(() => [setCreateAccountStepCompleted(), resetCreateAccountError()])
        )
    );

    loadProvinceFromIpLocationInfo$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setProvinceFromIpLocationInfo),
            map((data) => data.ipAddress),
            map((ipAddress) => getIpToLocationInfo({ ipAddress }))
        )
    );

    setProvinceSelectorVisibleForCanada$ = createEffect(() =>
        this._actions$.pipe(ofType(setProvinceSelectorVisibleForCanada), mapTo(setProvinceSelectionVisibleIfCanada({ isVisible: true })))
    );

    disableProvinceSelector$ = createEffect(() => this._actions$.pipe(ofType(setProvinceSelectorDisabled), mapTo(setProvinceSelectionDisabled({ isDisabled: true }))));

    enableProvinceSelector$ = createEffect(() => this._actions$.pipe(ofType(setProvinceSelectorEnabled), mapTo(setProvinceSelectionDisabled({ isDisabled: false }))));

    shouldDispatchCustomerOffersOnProvinceChange$ = createEffect(() =>
        this._actions$.pipe(
            ofType(provinceChanged),
            withLatestFrom(this._store.pipe(select(getSelectedProvince), pairwise())),
            filter(([_, [previousProvince, currentProvince]]) => isProvinceChangedToOrFromQuebec(previousProvince, currentProvince)),
            map(() => loadCustomerOffersOnProvinceChange())
        )
    );

    loadCustomerOffers$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(loadCustomerOffersOnProvinceChange),
                withLatestFrom(this._store.select(getOffersCustomerRequest)),
                map(([_, request]) => request),
                concatMap((request) => this._loadCustomerOffersWorkflow.build(request))
            ),
        { dispatch: false }
    );

    setLeadOfferPlanCodeFromPackageName$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setSelectedLeadOfferByPackageName),
            withLatestFrom(this._store.select(getAllOffersAsArray)),
            map(([{ packageName }, offers]) => {
                const offerFound = offers?.find((offer) => offer.packageName === packageName);
                if (offerFound) {
                    return setSelectedLeadOfferPlanCode({ planCode: offerFound.planCode });
                } else {
                    // if for some reason we don't find the offer by package name we return a noop action here so nothing gets done in state
                    return { type: 'noop' };
                }
            })
        )
    );

    onCreateAccountStepCompleted$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(setCreateAccountStepCompleted),
                withLatestFrom(this._store.select(getAllOffersAsArray)),
                concatMap(([, offers]) => {
                    return this._trialActivationRtpCheckNucaptchaRequiredWorkflowService.build(offers[0]?.planCode);
                })
            ),
        { dispatch: false }
    );

    newTransactionIdDueToCreditCardError$ = createEffect(() =>
        this._actions$.pipe(
            ofType(newTransactionIdDueToCreditCardError),
            flatMap(() => {
                const transactionId = `OAC-${uuid()}`;
                return [setTransactionId({ transactionId }), behaviorEventReactionForTransactionId({ transactionId })];
            })
        )
    );
}
