import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import {
    CheckoutState,
    getCheckoutState,
    LoadCheckoutFlepz,
    SetSweepstakesEligible,
    SetSweepstakesInfo,
    SetSweepstakesIneligible,
    CheckRTCFlow,
} from '@de-care/checkout-state';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { UrlHelperService } from '@de-care/app-common';
import { SetUpsellCode, SetMarketingPromoCode } from '@de-care/purchase-state';
import { CookieService } from 'ngx-cookie-service';
import { getPlatformFromName, ContestParams, OfferModel } from '@de-care/data-services';
import { SettingsService } from '@de-care/settings';

@Injectable({
    providedIn: 'root',
})
export class LoadCheckoutFlepzResolver implements Resolve<CheckoutState> {
    constructor(private store: Store<any>, private _urlHelperService: UrlHelperService, private _cookieService: CookieService, private _settingsService: SettingsService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<CheckoutState> {
        this._handleSweepstakes(route);
        // dispatching and runs the effect
        const upsellCode = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'upcode');
        const programcode = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'programcode');
        const sxmPlatformCookie = this._cookieService.get('sxm_platform');
        const platform = getPlatformFromName(sxmPlatformCookie);
        this.store.dispatch(SetUpsellCode({ payload: upsellCode }));

        const promocode = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'promocode');
        const renewalCode = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'renewalcode');
        const isStreaming = route.data.isStreaming;
        this.store.dispatch(SetMarketingPromoCode({ payload: { promocode, hidePromoCode: true } }));
        this.store.dispatch(
            LoadCheckoutFlepz({
                payload: {
                    marketingPromoCode: promocode,
                    programId: programcode,
                    upsellCode,
                    platform,
                    isStreaming,
                },
            })
        );
        // waits and filter when state is ready
        return this.store.select(getCheckoutState).pipe(
            filter((state: CheckoutState) => !state.loading),
            take(1),
            tap((state) => this._handleRtcCheck(renewalCode, state.offer)),
            map((state) => {
                if (state.error) {
                    throwError(state.error);
                }
                return state;
            })
        );
    }

    private _handleSweepstakes(route: ActivatedRouteSnapshot): void {
        const contestRules = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, ContestParams.contestUrl);
        const contestId = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, ContestParams.contestId);
        const contestEligible = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, ContestParams.contestEligible) === 'true';
        contestEligible && contestId && contestRules
            ? (this.store.dispatch(SetSweepstakesEligible()),
              this.store.dispatch(
                  SetSweepstakesInfo({
                      payload: {
                          contestId,
                          contestRules,
                      },
                  })
              ))
            : this.store.dispatch(SetSweepstakesIneligible());
    }

    private _handleRtcCheck(renewalCode: string, offer: OfferModel): void {
        if (offer) {
            this.store.dispatch(
                CheckRTCFlow({
                    payload: {
                        leadOffer: offer,
                        params: {
                            radioId: null,
                            planCode: offer.offers[0].planCode,
                            ...(!!renewalCode && { renewalCode }),
                        },
                    },
                })
            );
        }
    }
}
