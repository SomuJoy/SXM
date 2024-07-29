import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of, pipe } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import { OfferModel, DataOfferService, offerIsStreaming, getFirstOfferPackageName, isOfferRtc } from '@de-care/data-services';
import { HandleRTCStreamingParams } from '../config/types';
import * as CheckoutActions from './actions';
import { getCodeIs3For1AARtc } from './rtc.selectors';
import { behaviorEventReactionRenewalPlansPresented } from '@de-care/shared/state-behavior-events';

export const _handleRTC = (offer: OfferModel, params: HandleRTCStreamingParams, code: boolean) =>
    // TODO: If result of programcode is true for 3FOR1AARTC (code), the action to continue RTC is dispatched in the effect, and the flag is used to display
    // the "Change my renewal subscription" link and will guarantee the customer can continue in the RTC flow. Hardcoded programcode needs to be refactored.
    isOfferRtc(offer) || code ? CheckoutActions.RtcFlowContinued({ payload: { offer, params } }) : CheckoutActions.SetRTCFalse();

export const handleRtc = () => pipe(map(([{ leadOffer, params }, code]) => _handleRTC(leadOffer, params, code)));

export const setOrderSummaryDetailsExpanded = (value: boolean) =>
    pipe(map(() => (value ? CheckoutActions.SetOrderSummaryDetailsExpandedTrue() : CheckoutActions.SetOrderSummaryDetailsExpandedFalse())));

@Injectable()
export class RTCCheckoutEffects {
    constructor(private _actions$: Actions, private _dataOfferService: DataOfferService, private readonly _store: Store) {}

    @Effect()
    checkRTCFlow$: Observable<Action> = this._actions$.pipe(
        ofType(CheckoutActions.CheckRTCFlow),
        map(({ payload }) => payload),
        // TODO: Logic includes selector checking if programcode is 3FRO1AARTC. Hardcoded programcode should not be used in the logic, but this is a temporary solution.
        withLatestFrom(this._store.select(getCodeIs3For1AARtc)),
        handleRtc()
    );

    @Effect()
    setRtcTrue$ = this._actions$.pipe(
        ofType(CheckoutActions.RtcFlowContinued),
        map(() => CheckoutActions.SetRTCTrue())
    );

    @Effect()
    loadRenewalOfferPackages$: Observable<Action> = this._actions$.pipe(
        ofType(CheckoutActions.RtcFlowContinued),
        map(({ payload }) => payload),
        map(({ offer, params }) =>
            CheckoutActions.LoadRenewalOfferPackages({
                payload: {
                    offerRenewalRequest: {
                        ...params,
                        streaming: offerIsStreaming(offer),
                    },
                    defaultPackageName: getFirstOfferPackageName(offer),
                },
            })
        )
    );

    @Effect()
    setOrderSummaryDetailsExpandedTrue$: Observable<Action> = this._actions$.pipe(ofType(CheckoutActions.RtcFlowContinued), setOrderSummaryDetailsExpanded(true));

    @Effect()
    loadDefaultRenewalPlan$: Observable<Action> = this._actions$.pipe(
        ofType(CheckoutActions.LoadRenewalOfferPackages),
        map((data) => data.payload.defaultPackageName),
        map((packageName) => CheckoutActions.SetDefaultRenewalPlan({ payload: { packageName } }))
    );

    @Effect()
    loadRenewalPackageOptions$: Observable<Action> = this._actions$.pipe(
        ofType(CheckoutActions.LoadRenewalOfferPackages),
        map((data) => data.payload.offerRenewalRequest),
        switchMap((payload) =>
            this._dataOfferService.getOfferRenewal(payload).pipe(switchMap((data) => [CheckoutActions.LoadRenewalOfferPackagesSuccess({ payload: data })]))
        ),
        catchError((error) => of(CheckoutActions.LoadRenewalOfferPackagesError({ payload: error })))
    );

    // Renewal offers need to be loadad in the datalayer (Analytics) after susccessful response of the renewal offers service
    @Effect()
    trackRenewalOffersForAnalytics$: Observable<Action> = this._actions$.pipe(
        ofType(CheckoutActions.LoadRenewalOfferPackagesSuccess),
        map((data) =>
            data.payload.map((offer) => {
                return { planCode: offer.planCode, price: offer.price };
            })
        ),
        map((presented) => behaviorEventReactionRenewalPlansPresented({ presented }))
    );
}
