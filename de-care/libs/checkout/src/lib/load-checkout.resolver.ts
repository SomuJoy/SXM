// ===============================================================================
// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';

// ===============================================================================
// internal features
import { CheckoutState, getCheckoutState, LoadCheckout, SetSweepstakesIneligible, SetSweepstakesInfo, SetSweepstakesEligible } from '@de-care/checkout-state';
// ===============================================================================
// Libs
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { LANGUAGE_CODES, SettingsService, UserSettingsService } from '@de-care/settings';
import { SetUpsellCode, SetMarketingPromoCode } from '@de-care/purchase-state';
import { UrlHelperService, NormalizeLangPrefHelperService } from '@de-care/app-common';

import { SessionTimedOut, BrowserSessionTrackerService } from '@de-care/shared/browser-common/state-session-tracker';
import { TranslateService } from '@ngx-translate/core';
import { AccountModel, ContestParams, TokenPayloadType } from '@de-care/data-services';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class LoadCheckoutResolver implements Resolve<CheckoutState> {
    constructor(
        private store: Store<any>,
        private _settingsService: SettingsService,
        private _urlHelperService: UrlHelperService,
        private _browserSessionTrackerService: BrowserSessionTrackerService,
        private _userSettingsService: UserSettingsService,
        private _translateService: TranslateService,
        private _normalizeLangPrefParamHelperService: NormalizeLangPrefHelperService,
        private _cookieService: CookieService
    ) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot, account?: AccountModel): Observable<CheckoutState> {
        this._wireUpSessionTracking();
        this._handleSweepstakes(route);
        // dispatching and runs the effect
        const langPrefParam: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'langpref');
        const dtok: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'dtok');
        const tkn: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'tkn');
        const atok: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'atok');
        const programcode: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'programcode');
        const tbView: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'tbView');
        const radioId: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'RadioID');
        const accountNumber: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'act');
        const lastName: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'lname');
        const upsellCode: string = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'upcode');
        this.store.dispatch(SetUpsellCode({ payload: upsellCode }));
        const promocode = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'promocode');
        const renewalCode = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'renewalCode');
        const proactiveFlow = route.params?.proactiveFlow?.toLowerCase() === 'true';
        const isIdentifiedUser: boolean = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'isIdentifiedUser') === 'true';

        const isStreaming = route.data.isStreaming;

        let token: string;
        let tokenType: TokenPayloadType;
        if (dtok) {
            token = dtok;
            tokenType = TokenPayloadType.SalesAudio;
        } else if (tkn) {
            token = tkn;
            tokenType = TokenPayloadType.SalesAudio;
        } else if (atok && !radioId) {
            token = atok;
            tokenType = TokenPayloadType.Account;
        } else if (!radioId) {
            token = this._cookieService.get('ID_TOKEN');
            if (token) {
                tokenType = TokenPayloadType.Account;
            }
        }

        this.store.dispatch(SetMarketingPromoCode({ payload: { promocode, hidePromoCode: true } }));

        this.store.dispatch(
            LoadCheckout({
                payload: {
                    programId: programcode,
                    token,
                    radioId,
                    accountNumber,
                    isStreaming,
                    account,
                    lastName,
                    upsellCode,
                    marketingPromoCode: promocode,
                    renewalCode,
                    tbView,
                    proactiveFlow,
                    isIdentifiedUser,
                    tokenType,
                },
            })
        );
        // waits and filter when state is ready
        return this.store.select(getCheckoutState).pipe(
            filter((state: CheckoutState) => !state.loadingRTC && !state.loading),
            take(1),
            map((state) => {
                if (state.error) {
                    throwError(state.error);
                } else if (this._settingsService.isCanadaMode) {
                    this._userSettingsService.setProvinceSelectionDisabled(true);
                    const serviceAddress = state.account.serviceAddress;
                    if (serviceAddress && serviceAddress.state) {
                        this._userSettingsService.setSelectedCanadianProvince(serviceAddress.state);
                    }
                    if (!this._normalizeLangPrefParamHelperService.langPrefValid(langPrefParam) && this._userSettingsService.isQuebec()) {
                        this._translateService.use(LANGUAGE_CODES.FR_CA);
                    }
                }
                return state;
            })
        );
    }

    private _wireUpSessionTracking(): void {
        // Note: apiLastCallTimerLimitReached$ will complete once apiLastCallTimerLimit is reached so no need to unsubscribe
        this._browserSessionTrackerService.apiLastCallTimerLimitReached$.subscribe(() => {
            this.store.dispatch(new SessionTimedOut());
        });
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
}
