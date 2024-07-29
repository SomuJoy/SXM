import { Injectable } from '@angular/core';
import { CHECKOUT_CONSTANT, SelectedUpsell } from '@de-care/checkout-state';
import { DataLayerService } from '@de-care/data-layer';
import { DataLayerDataTypeEnum, DataPurchaseService, getRadioIdFromAccount, UpsellRequestData } from '@de-care/data-services';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { from } from 'rxjs';
import { concatMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { PurchaseStateConstant } from '../../purchase-state.constant';
import { GetUpsells, LoadSelectedOffer, ReceiveUpsells } from '../actions/purchase.actions';

@Injectable()
export class UpsellEffects {
    upsell$ = createEffect(() =>
        this._actions$.pipe(
            ofType(GetUpsells),
            map((action) => action.payload),
            // TODO: The payload appears to have the last 4 of radio id so maybe this withLatestFrom is no longer needed?
            withLatestFrom(this._store$, this._userSettingsService.selectedCanadianProvince$, (payload: UpsellRequestData, state, province) => {
                const account = state[CHECKOUT_CONSTANT.STORE.NAME].account;
                const selectedOffer = state[PurchaseStateConstant.STORE.NAME].data.selectedOffer;
                const planCodeToAutoSelect = selectedOffer ? selectedOffer.offers[0].planCode : null;
                const radioId = getRadioIdFromAccount(account) || payload?.radioId?.slice(-4);
                return {
                    planCodeToAutoSelect,
                    upsellOffersPayload: {
                        // Only add a radioId property if the account has one. Doing otherwise will result in the GetUpsell microservice having an error
                        ...(radioId && {
                            radioId,
                        }),
                        planCode: payload.planCode,
                        subscriptionId: payload.subscriptionId,
                        upsellCode: payload.upsellCode,
                        province: this._settingsService.isCanadaMode ? province : undefined,
                        retrieveFallbackOffer: payload.retrieveFallbackOffer,
                        streaming: payload.streaming,
                    },
                };
            }),
            switchMap((payload) =>
                this._purchaseService.getUpsellOffers(payload.upsellOffersPayload).pipe(map((offers) => ({ offers, planCodeToAutoSelect: payload.planCodeToAutoSelect })))
            ),
            concatMap(({ offers, planCodeToAutoSelect }) => {
                const actions: Action[] = [ReceiveUpsells({ payload: offers.offers })];
                this._dataLayerSrv.update(DataLayerDataTypeEnum.UpsellData, offers);
                if (planCodeToAutoSelect) {
                    const newSelectedOffer = offers.offers.find((plan) => plan.planCode === planCodeToAutoSelect);
                    if (newSelectedOffer) {
                        const upsellData = { offers: [newSelectedOffer] };
                        actions.push(LoadSelectedOffer({ payload: upsellData }));
                        actions.push(SelectedUpsell({ payload: upsellData }));
                    }
                }
                return from(actions);
            })
        )
    );

    constructor(
        private _actions$: Actions,
        private _store$: Store<any>,
        private _purchaseService: DataPurchaseService,
        private _dataLayerSrv: DataLayerService,
        private _settingsService: SettingsService,
        private _userSettingsService: UserSettingsService
    ) {}
}
