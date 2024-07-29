import { Injectable } from '@angular/core';
import { ClearUpsell, getAccountServiceAddressState, getActiveOrClosedRadioIdOnAccount, getCheckoutLeadOfferPlanCode, SelectedUpsell } from '@de-care/checkout-state';
import { selectFirstFollowOnOfferPlanCode } from '@de-care/domains/offers/state-follow-on-offers';
import { LoadOffersInfoWorkflowService } from '@de-care/domains/offers/state-offers-info';
import { getUpgrade, LoadQuote, LoadSelectedOffer } from '@de-care/purchase-state';
import { UserSettingsService } from '@de-care/settings';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createAction, props, select, Store } from '@ngrx/store';
import { flatMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { upsellPlanCodeChangeCompleted, upsellPlanCodeSelected, upsellPlanCodeUnselected } from './cms-triage-upsell.actions';
import { getDataForQuotesLoad } from './purchase-triage.selectors';

const loadOffersInfoAndSetSelectedOffer = createAction(
    '[Checkout] load offers info for selected offer and set selected offer',
    props<{
        planCode: string;
        selectedOfferIsUpsell: boolean;
    }>()
);

@Injectable()
export class CmsTriageUpsellSelectionEffects {
    constructor(
        private readonly _actions$: Actions,
        private readonly _store: Store,
        private readonly _loadOffersInfoWorkflowService: LoadOffersInfoWorkflowService,
        private _userSettings: UserSettingsService
    ) {}

    upsellSelected$ = createEffect(() =>
        this._actions$.pipe(
            ofType(upsellPlanCodeSelected),
            map(({ planCode }) => loadOffersInfoAndSetSelectedOffer({ planCode, selectedOfferIsUpsell: true }))
        )
    );

    upsellUnselected$ = createEffect(() =>
        this._actions$.pipe(
            ofType(upsellPlanCodeUnselected),
            withLatestFrom(this._store.pipe(select(getCheckoutLeadOfferPlanCode))),
            map(([_, planCode]) => loadOffersInfoAndSetSelectedOffer({ planCode, selectedOfferIsUpsell: false }))
        )
    );

    loadOffersInfoAndSetSelectedOffer$ = createEffect(() =>
        this._actions$.pipe(
            ofType(loadOffersInfoAndSetSelectedOffer),
            withLatestFrom(
                this._store.pipe(select(getAccountServiceAddressState)),
                this._userSettings.selectedCanadianProvince$,
                this._store.pipe(select(getActiveOrClosedRadioIdOnAccount)),
                this._store.pipe(select(getIsCanadaMode)),
                this._store.pipe(select(selectFirstFollowOnOfferPlanCode))
            ),
            switchMap(([{ planCode, selectedOfferIsUpsell }, serviceAddressState, selectedProvince, radioId, isCanadaMode, followOnPlanCode]) =>
                this._loadOffersInfoWorkflowService
                    .build({
                        planCodes: [{ leadOfferPlanCode: planCode, followOnPlanCode: followOnPlanCode ?? undefined }],
                        ...(isCanadaMode && { province: serviceAddressState || selectedProvince }),
                        ...(radioId && { radioId }),
                    })
                    .pipe(
                        withLatestFrom(this._store.pipe(select(getUpgrade))),
                        map(([_, { upgrade: upsellOffers }]) => {
                            if (selectedOfferIsUpsell) {
                                return {
                                    offers: [upsellOffers.find((offer) => offer.planCode === planCode)],
                                };
                            } else {
                                return null;
                            }
                        }),
                        flatMap((offerModel: any) => [
                            LoadSelectedOffer({ payload: offerModel }),
                            SelectedUpsell({ payload: offerModel }),
                            ...(!selectedOfferIsUpsell ? [ClearUpsell()] : []),
                            upsellPlanCodeChangeCompleted(),
                        ])
                    )
            )
        )
    );

    upsellPlanCodeChangeCompleted$ = createEffect(() =>
        this._actions$.pipe(
            ofType(upsellPlanCodeChangeCompleted),
            withLatestFrom(this._store.pipe(select(getDataForQuotesLoad))),
            flatMap(([_, payload]) => [
                LoadQuote({ payload }),
                // dispatch 'continue-upgrade' event to track plan code selected
            ])
        )
    );
}
