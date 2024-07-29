import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { UrlHelperService } from '@de-care/app-common';
import { CheckoutState, CheckRTCFlow, getIsRtc, getLoadingRtc, getRenewalPackageOptions, SetProactiveRTCTrue, UpdateCheckoutAccount } from '@de-care/checkout-state';
import { DataOfferService, PackageModel, radioLastFour, normalizeAccountNumber, PlanTypeEnum, OfferDetailsModel, isOfferMCP } from '@de-care/data-services';
import { select, Store } from '@ngrx/store';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { RtcNavigationService } from './rtc-navigation.service';
import { RtcLandingPageService } from './rtc/rtc-landing-page/rtc-landing-page.service';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';
import { behaviorEventReactionForProgramCode, behaviorEventReactionLookupByAccountNumberAndRadioIdSuccess } from '@de-care/shared/state-behavior-events';

export interface RtcResolverData {
    accountNumber: string;
    leadOffer: PackageModel;
    programCode: string;
    radioId: string;
    renewalOptions: PackageModel[];
    offerDetails: OfferDetailsModel;
    containsChoicePackages: boolean;
}

@Injectable()
export class RtcResolver implements Resolve<Observable<RtcResolverData>> {
    constructor(
        private _nonPiiSrv: NonPiiLookupWorkflow,
        private _offerService: DataOfferService,
        private _rtcLandingPageService: RtcLandingPageService,
        private _rtcNavigationService: RtcNavigationService,
        private _store: Store<CheckoutState>,
        private _urlHelperService: UrlHelperService
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        this._rtcLandingPageService.isLoading();

        const programCode = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'programCode');
        const radioId = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'radioId');
        const radioIdLast4 = radioLastFour(radioId);
        const accountNumber = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'act');
        const renewalCode = this._urlHelperService.getCaseInsensitiveParam(route.queryParamMap, 'renewalCode');
        const normalizedAccountNumber = normalizeAccountNumber(accountNumber);
        return this._nonPiiSrv.build({ accountNumber: normalizedAccountNumber, radioId }).pipe(
            tap(_ => this._store.dispatch(behaviorEventReactionLookupByAccountNumberAndRadioIdSuccess())),
            switchMap(account => {
                if (!this._containsSelfPaidSubscriptions(account)) {
                    this._store.dispatch(UpdateCheckoutAccount({ payload: account }));
                    return this._offerService.customer({ radioId: radioIdLast4, programCode }).pipe(
                        tap(leadOffer =>
                            this._store.dispatch(
                                CheckRTCFlow({
                                    payload: {
                                        leadOffer,
                                        params: {
                                            radioId: radioIdLast4,
                                            planCode: leadOffer.offers[0].planCode,
                                            renewalCode
                                        }
                                    }
                                })
                            )
                        ),
                        switchMap(offer => combineLatest([of(offer), this._store.pipe(select(getLoadingRtc))])),
                        filter(([, isLoading]) => !isLoading),
                        map(([offer]) => offer.offers[0]),
                        withLatestFrom(this._store.pipe(select(getIsRtc)), this._store.pipe(select(getRenewalPackageOptions))),
                        tap(() => this._store.dispatch(SetProactiveRTCTrue())),
                        tap(() => programCode && this._store.dispatch(behaviorEventReactionForProgramCode({ programCode }))),
                        map(([offer, isRtc, renewalOptions]) =>
                            isRtc
                                ? {
                                      accountNumber,
                                      leadOffer: offer,
                                      programCode,
                                      radioId,
                                      renewalOptions: this._updateRenewalOptions(renewalOptions),
                                      offerDetails: this._getOfferDetails(offer),
                                      containsChoicePackages: this._checkContainsChoicePackages(renewalOptions)
                                  }
                                : this._exitRtcFlow(accountNumber, radioId, programCode, renewalCode)
                        ),
                        take(1)
                    );
                } else {
                    this._exitRtcFlow(accountNumber, radioId, programCode, renewalCode);
                }
            })
        );
    }

    private _getOfferDetails(offer: PackageModel): OfferDetailsModel {
        return {
            type: offer.deal ? offer.deal.type : this._getOfferType(offer.type),
            offerTotal: offer.price,
            processingFee: offer.processingFee,
            msrpPrice: offer.msrpPrice,
            name: offer.packageName,
            offerTerm: offer.termLength,
            offerMonthlyRate: offer.pricePerMonth,
            savingsPercent: Math.floor(((offer.retailPrice - offer.pricePerMonth) / offer.retailPrice) * 100),
            retailRate: offer.retailPrice,
            etf: offer.deal && offer.deal.etfAmount,
            etfTerm: offer.deal && offer.deal.etfTerm,
            priceChangeMessagingType: offer.priceChangeMessagingType,
            isStreaming: false,
            deal: offer.deal,
            isMCP: isOfferMCP(offer.type),
            isLongTerm: offer.type === 'LONG_TERM' ? true : false,
            offerType: offer.type
        };
    }
    private _getOfferType(offerType: string): string {
        if (offerType === PlanTypeEnum.Promo || offerType === PlanTypeEnum.TrialExtension) {
            return offerType;
        } else if (offerType === PlanTypeEnum.RtpOffer || offerType === PlanTypeEnum.Trial || offerType === PlanTypeEnum.TrialRtp) {
            return PlanTypeEnum.Promo;
        }
        return PlanTypeEnum.Default;
    }

    private _exitRtcFlow(accountNumber, radioId, programCode, renewalCode) {
        this._rtcNavigationService.goToCheckout(accountNumber, radioId, programCode, renewalCode);
        return EMPTY;
    }

    private _checkContainsChoicePackages(renewalOptions: PackageModel[]): boolean {
        return !!renewalOptions?.map(offer => offer?.parentPackageName).find(pkgName => pkgName?.includes('CHOICE'));
    }

    private _updateRenewalOptions(renewalOptions: PackageModel[]): PackageModel[] {
        const containsChoicePackages = this._checkContainsChoicePackages(renewalOptions);
        if (containsChoicePackages) {
            const packagesToDisplay = 3;
            return renewalOptions.slice(-packagesToDisplay);
        }
        return renewalOptions;
    }

    private _containsSelfPaidSubscriptions(account): boolean {
        return (
            account?.subscriptions &&
            Array.isArray(account?.subscriptions) &&
            account?.subscriptions.length > 0 &&
            !!account?.subscriptions[0].plans.find(plan => plan && plan.type && plan.type === PlanTypeEnum.SelfPaid)
        );
    }
}
