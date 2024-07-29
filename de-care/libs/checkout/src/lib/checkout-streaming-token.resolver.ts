import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { AccountModel, CheckoutTokenResolverErrors, DataAccountService, getFirstOffer, OfferModel, PlanTypeEnum, TokenPayloadType } from '@de-care/data-services';
import { UrlHelperService } from '@de-care/app-common';
import { clearCheckoutStateRelatedData } from '@de-care/de-care-use-cases/checkout/state-checkout-triage';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { LoadCheckoutFlepzResolver } from './load-checkout-flepz.resolver';
import { LoadCheckoutResolver } from './load-checkout.resolver';
import { CheckoutState } from '@de-care/checkout-state';
import { LANGUAGE_CODES, UserSettingsService } from '@de-care/settings';
import { TranslateService } from '@ngx-translate/core';

export interface CheckoutTokenResolverInfo {
    error: boolean;
    errorType?: CheckoutTokenResolverErrors;
    account?: AccountModel;
    maskedUserNameFromToken?: string;
}

export interface CheckoutTokenResolverResponse {
    checkoutState: CheckoutState;
    tokenInfo: CheckoutTokenResolverInfo;
    streamingFlepz: boolean;
}

interface HandleResolversResponse {
    checkoutState: CheckoutState;
    streamingFlepz: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CheckoutStreamingTokenResolver implements Resolve<CheckoutTokenResolverResponse> {
    constructor(
        private readonly _dataAccountService: DataAccountService,
        private readonly _urlHelperService: UrlHelperService,
        private readonly _loadCheckoutResolver: LoadCheckoutResolver,
        private readonly _loadCheckoutFlepzResolver: LoadCheckoutFlepzResolver,
        private readonly _userSettingsService: UserSettingsService,
        private readonly _translateService: TranslateService,
        private readonly _router: Router,
        private readonly _store: Store
    ) {}

    resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<CheckoutTokenResolverResponse> {
        return this._getTokenInfo(route).pipe(
            concatMap(tokenInfo =>
                this._handleResolvers(tokenInfo, route, routerState).pipe(
                    map(({ checkoutState, streamingFlepz }) => {
                        if (this._offerIsRtdTrialStreaming(checkoutState?.offer)) {
                            this._router.navigate(['subscribe', 'trial', 'streaming'], { queryParams: route.queryParams }).then(() => {
                                // TODO: we need to empty all the streaming checkout state data here before redirect
                                //       because we need to treat this as if we never landed on subscribe checkout streaming
                                this._store.dispatch(clearCheckoutStateRelatedData());
                            });
                            return null;
                        } else {
                            const status = route?.queryParams?.status;

                            return {
                                checkoutState,
                                tokenInfo,
                                streamingFlepz,
                                ...(status && { isPromoCodeRedirect: status === 'i' })
                            };
                        }
                    })
                )
            )
        );
    }

    private _offerIsRtdTrialStreaming(offerModel: OfferModel): boolean {
        return getFirstOffer(offerModel)?.type === PlanTypeEnum.RtdTrial;
    }

    private _handleResolvers(tokenInfo: CheckoutTokenResolverInfo, route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<HandleResolversResponse> {
        let observable: Observable<HandleResolversResponse>;
        if (tokenInfo.error && (tokenInfo.errorType === CheckoutTokenResolverErrors.InvalidToken || tokenInfo.errorType === CheckoutTokenResolverErrors.EmptyToken)) {
            observable = this._loadCheckoutFlepzResolver.resolve(route).pipe(
                map(checkoutState => ({
                    checkoutState,
                    streamingFlepz: true
                }))
            );
        } else {
            observable = this._loadCheckoutResolver.resolve(route, routerState, tokenInfo.account).pipe(
                map(checkoutState => ({
                    checkoutState,
                    streamingFlepz: false
                }))
            );
        }

        return observable;
    }

    private _getTokenInfo(route: ActivatedRouteSnapshot): Observable<CheckoutTokenResolverInfo> {
        const token = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'tkn');
        if (token) {
            return this._dataAccountService
                .getFromToken(
                    {
                        token,
                        tokenType: TokenPayloadType.SalesStreaming
                    },
                    false
                )
                .pipe(
                    map(response => {
                        let account = response.nonPIIAccount;
                        const maskedUserNameFromToken = response.maskedUserNameFromToken || null;
                        let error = false;
                        let errorType: CheckoutTokenResolverErrors;
                        const subscription = account.subscriptions[0];

                        this._updateTranslation(account.serviceAddress);

                        if (!subscription) {
                            if (account.accountProfile.accountRegistered && response.isUserNameInTokenSameAsAccount) {
                                error = true;
                                errorType = CheckoutTokenResolverErrors.AddSubscriptionFlow;
                            } else {
                                account = this._dataAccountService.generateEmptyAccount();
                                error = true;
                                errorType = CheckoutTokenResolverErrors.NewAccountFlow;
                            }
                        } else if (subscription.followonPlans && subscription.followonPlans.length > 0) {
                            error = true;
                            errorType = CheckoutTokenResolverErrors.HasFollowOn;
                        } else if (subscription.plans[0].type === PlanTypeEnum.SelfPaid) {
                            error = true;
                            errorType = CheckoutTokenResolverErrors.SelfPaid;
                        }
                        return {
                            error,
                            errorType,
                            account,
                            maskedUserNameFromToken
                        };
                    }),
                    catchError(e => {
                        if (e.status === 401 || e.status === 400 || e.status === 404) {
                            return of({
                                error: true,
                                errorType: CheckoutTokenResolverErrors.InvalidToken
                            });
                        } else {
                            return throwError(e);
                        }
                    })
                );
        } else {
            return of({
                error: true,
                errorType: CheckoutTokenResolverErrors.EmptyToken
            });
        }
    }

    private _updateTranslation(serviceAddress: { state: string }): void {
        this._userSettingsService.setSelectedCanadianProvince(serviceAddress ? serviceAddress.state : undefined);
        if (this._userSettingsService.isQuebec()) {
            this._translateService.use(LANGUAGE_CODES.FR_CA);
        }
    }
}
