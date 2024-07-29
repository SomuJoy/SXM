import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    activeSubscriptionCloseRerouteToFlepz,
    activeSubscriptionCloseRerouteToProactiveRtc,
    buildDataLayerCustomerInfo,
    buildDataLayerPlanInfoProducts,
    ClearActiveSubscriptionFound,
    getActiveSubscriptionFound,
    getActiveSubscriptionInfo,
    getIsStudentFlow,
    getIsRtc,
    LoadCheckoutFlepzAccount,
    SetIsStreaming,
    SetMaskedUserNameFromToken,
    SetOfferNaAccepted,
    showDefaultOfferBehavior,
    getDefaultOfferBehaviorReason,
    checkoutCouldHideLoader,
    getIsStreaming,
} from '@de-care/checkout-state';
import {
    AccountModel,
    CheckoutTokenResolverErrors,
    EventErrorEnum,
    ComponentNameEnum,
    DataLayerActionEnum,
    OfferModel,
    OfferNotAvailableReasonEnum,
    PurchaseStepEnum,
} from '@de-care/data-services';
import {
    checkoutComponentVM,
    getCheckoutAccount,
    getHeroTitleType,
    getIsBetterOffer,
    getIsTokenizedLink,
    getOfferOrUpsell,
    getOfferOrUpsellPrice,
    getOfferOrUpsellPricingInfo,
    getOfferState,
    getProgramCode,
    getFollowOnOfferPrice,
    getOfferOrUpsellIsUpgradePromo,
    getOfferOrUpsellDeal,
    getContinueToFallbackOffer,
    getSalesHeroCopyVM,
    getOfferDescriptionCopyVM,
    getDealAddonCopyVM,
    getIsPickAPlan,
    getNotEligibleForStreamingPlan,
    getNuCaptchaRequired,
    getDeviceLookupPrefillDataViewModel,
    getOtherOffersLinkEligible,
    clearCheckoutStateRelatedData,
    getOtherPlansQueryParamsAndPath,
    getPurchaseProgramCode,
} from '@de-care/de-care-use-cases/checkout/state-checkout-triage';
import { ActiveSubscriptionInfo } from '@de-care/identification';
import { getHideMarketingPromoCode, getMarketingPromoCode, getSubmitOrderRequested, PurchaseState, PurchaseStateConstant } from '@de-care/purchase-state';
import { SettingsService } from '@de-care/settings';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, combineLatest, timer, of } from 'rxjs';
import { filter, switchMap, takeUntil, tap, map, take, debounceTime, withLatestFrom, startWith, concatMap } from 'rxjs/operators';
import { scrollToTop } from '@de-care/browser-common';
import { behaviorEventImpressionForComponent, behaviorEventInteractionLinkClick } from '@de-care/shared/state-behavior-events';
import { HeroTitleTypeEnum } from '@de-care/domains/offers/ui-hero';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { SharedEventTrackService } from '@de-care/data-layer';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';

@Component({
    selector: 'app-satellite-streaming-purchase-page',
    templateUrl: './satellite-streaming-purchase-page.component.html',
    styleUrls: ['./satellite-streaming-purchase-page.component.scss'],
})
export class SatelliteStreamingPurchasePageComponent implements OnInit, OnDestroy, AfterViewInit {
    vm$ = this._store.pipe(
        select(checkoutComponentVM),
        withLatestFrom(this._store.pipe(select(getIsStreaming)), this._store.pipe(select(getNormalizedQueryParams))),
        map(([vm, isStreaming, params]) => {
            if (vm.showOfferNotAvailable) {
                let redirectQueryParams = '';
                if (params?.tkn) {
                    redirectQueryParams += '?tkn=' + params?.tkn;
                } else if (params?.radioid && params?.act) {
                    redirectQueryParams += '?radioId=' + params?.radioid + '&act=' + params?.act;
                }
                const extraPath = `${isStreaming ? '/streaming' : ''}`;
                const basePath = `subscribe/checkout/purchase${extraPath ? extraPath : '/satellite'}`;
                const ctaParam = `?ctaURL=${encodeURIComponent(`/subscribe/checkout${extraPath}${redirectQueryParams}`)}`;
                const nonAccordionCtaparam = `?ctaURL=${encodeURIComponent(`subscribe/checkout/purchase${extraPath}/organic`)}`;
                this._store.dispatch(clearCheckoutStateRelatedData());
                switch (vm.offerNotAvailableInfo?.offerNotAvailableReason) {
                    case 'EXPIRED':
                    case 'OUTSIDE_START_AND_END_DATE': {
                        this.router.navigateByUrl(`${basePath}/expired-offer-error${ctaParam}`, { replaceUrl: true });
                        break;
                    }
                    case 'REDEEMED':
                    case 'ALREADY_REDEEMED': {
                        this.router.navigateByUrl(`${basePath}/promo-code-redeemed-error${ctaParam}`, { replaceUrl: true });
                        break;
                    }
                    default: {
                        let redirectUrl = isStreaming ? nonAccordionCtaparam : ctaParam;
                        this.router.navigateByUrl(`${basePath}/generic-error${redirectUrl}`, { replaceUrl: true });
                        break;
                    }
                }
            }
            return vm;
        })
    );
    nuCaptchaRequired$ = this._store.pipe(select(getNuCaptchaRequired));
    salesHeroCopyVM$ = this._store.select(getSalesHeroCopyVM).pipe(
        concatMap((heroData) => {
            if (heroData?.title === 'DEFAULT_TITLE') {
                return this._translateService.stream(this.translateKey + 'DEFAULT_OFFER_HERO').pipe(
                    map((title) => ({
                        title,
                    }))
                );
            }
            return of(heroData);
        })
    );
    offerDescriptionCopyVM$ = this._store.pipe(select(getOfferDescriptionCopyVM));
    dealAddonCopyVM$ = this._store.pipe(select(getDealAddonCopyVM));
    programCode$ = this._store.pipe(select(getProgramCode));
    offers$ = this._store.pipe(select(getOfferState));
    account$ = this._store.pipe(select(getCheckoutAccount));
    isTokenizedLink$ = this._store.pipe(select(getIsTokenizedLink));
    offer$ = this._store.pipe(select(getOfferOrUpsell));
    betterPricingAvailable$ = this._store.pipe(select(getIsBetterOffer));
    pricingInfo$ = this._store.pipe(select(getOfferOrUpsellPricingInfo));

    isRTC$ = this._store.pipe(select(getIsRtc));
    isUpgradePromo$ = this._store.pipe(select(getOfferOrUpsellIsUpgradePromo));
    marketingPromoCode$ = this._store.pipe(select(getMarketingPromoCode));
    hideMarketingPromoCode$ = this._store.pipe(select(getHideMarketingPromoCode));
    isPickAPlan$ = this._store.pipe(select(getIsPickAPlan));
    notEligibleForStreamingPlan$ = this._store.pipe(select(getNotEligibleForStreamingPlan));
    errorCode$ = this._store.select(getNormalizedQueryParams).pipe(map(({ errorcode }) => errorcode as string));
    displayOtherOffersLink$ = this._store.select(getOtherOffersLinkEligible);

    isStudentFlow = false;
    heroTitleType$ = combineLatest([
        this._store.pipe(select(getHeroTitleType)),
        this._store.pipe(select(getOfferOrUpsellDeal)),
        this._store.pipe(select(getIsPickAPlan)),
    ]).pipe(
        map(([heroTitleType, promoDeal, isPickAPlan]) => {
            return heroTitleType === 'STREAMING' && this.isStreamingOrganicScenario && !promoDeal
                ? HeroTitleTypeEnum.OrganicStreamingOnly
                : heroTitleType === HeroTitleTypeEnum.UpgradePromo && !promoDeal && this._settingsService.isCanadaMode
                ? HeroTitleTypeEnum.Get
                : isPickAPlan
                ? HeroTitleTypeEnum.PickAPlan
                : heroTitleType;
        })
    );

    followOnOfferPrice$ = this._store.pipe(select(getFollowOnOfferPrice));
    showDefaultBehavior$ = this._store.pipe(select(showDefaultOfferBehavior));
    getDefaultOfferBehaviorReason$ = this._store.pipe(select(getDefaultOfferBehaviorReason));

    isFlepz: boolean = false;
    isStreaming = false;
    token: string;
    isPromoCodeRedirect: boolean;
    activeSubscriptionModalOpen = false;
    activeSubscriptionFound$: Observable<ActiveSubscriptionInfo>;
    offerPrice: number;

    streamingError: CheckoutTokenResolverErrors;
    userNameFromToken: string = null;
    offerNotAvailableReason: OfferNotAvailableReasonEnum;
    isStreamingOrganicScenario = false;
    translateKey = 'checkout.satelliteStreamingPurchasePageComponent.';
    isCanada = this._settingsService.isCanadaMode;

    deviceLookupPrefillDataViewModel$ = this._store.select(getDeviceLookupPrefillDataViewModel);

    @HostBinding('attr.data-e2e')
    dataE2e = 'satelliteStreamingPurchasePage';

    private _unsubscribe: Subject<void> = new Subject();
    private readonly _window: Window;

    @ViewChild('activeSubscriptionModal') private _activeSubscriptionModal: SxmUiModalComponent;

    constructor(
        private acRoute: ActivatedRoute,
        private _store: Store<any>,
        private router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private _settingsService: SettingsService,
        @Inject(DOCUMENT) document: Document,
        private _translateService: TranslateService,
        private _eventTrackService: SharedEventTrackService
    ) {
        this._window = document.defaultView;
    }

    ngOnInit() {
        this._store.pipe(select(getIsStudentFlow), takeUntil(this._unsubscribe)).subscribe((isStudent) => {
            this.isStudentFlow = isStudent;
            this._checkForStreamingOrganicScenario();
        });
        // subscription for checkout feature
        this.acRoute.data.subscribe((data) => {
            if (data.isStreaming) {
                this._store.dispatch(SetIsStreaming({ payload: { isStreaming: true } }));
                this.isStreaming = true;
                this.isFlepz = data.streamingTokenData.streamingFlepz;
                this.streamingError = data.streamingTokenData.tokenInfo.errorType;
                this.userNameFromToken = data.streamingTokenData.tokenInfo.maskedUserNameFromToken;
                this.isPromoCodeRedirect = data.streamingTokenData.isPromoCodeRedirect;
                this._store.dispatch(SetMaskedUserNameFromToken({ payload: this.userNameFromToken }));
            } else {
                this.isFlepz = data.isFlepz;
            }
            this._checkForStreamingOrganicScenario();
        });

        this._store.pipe(select(getOfferOrUpsellPrice), takeUntil(this._unsubscribe)).subscribe(({ offerOrUpsellExists, isFreeOffer, offerPrice, processingFee }) => {
            if (offerOrUpsellExists) {
                if (isFreeOffer && this._settingsService.isCanadaMode && processingFee !== null) {
                    this.offerPrice = processingFee;
                } else {
                    this.offerPrice = offerPrice;
                }
            }
            this._changeDetectorRef.markForCheck(); // TODO: Is this necessary any more?
        });

        if (this.isPromoCodeRedirect) {
            this._store.pipe(takeUntil(this._unsubscribe), select(getContinueToFallbackOffer)).subscribe((shouldContinueToFallbackOffer) => {
                shouldContinueToFallbackOffer && this.continueToFallbackOffer();
            });
        }

        this._store
            .pipe(
                takeUntil(this._unsubscribe),
                select(getSubmitOrderRequested),
                filter((submitted) => submitted)
            )
            .subscribe(() => {
                this._buildDataLayerCustomerInfo();
                this._buildDataLayerPlanInfoProducts();
                this.router.navigate(['/subscribe/checkout/thanks'], {
                    state: {
                        isStreaming: this.isStreaming,
                    },
                });
            });

        // Subscription for stored feature module 'purchaseFeature'
        this._store
            .select((state) => state[PurchaseStateConstant.STORE.NAME])
            .pipe(takeUntil(this._unsubscribe))
            .subscribe((state: PurchaseState) => {
                if (state.data.account) {
                    if (this.isFlepz && !this.account$) {
                        this._store.dispatch(LoadCheckoutFlepzAccount({ payload: { account: state.data.account } }));
                    }
                }
            });

        // Leave this here
        this.activeSubscriptionFound$ = this._store.pipe(
            select(getActiveSubscriptionFound),
            tap((found) => (this.activeSubscriptionModalOpen = found)),
            filter((found) => found),
            switchMap(() => {
                this._store.dispatch(pageDataFinishedLoading());
                this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Overlay:ActiveSubscription' }));
                return this._store.pipe(select(getActiveSubscriptionInfo));
            })
        );
    }

    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    ngAfterViewInit(): void {
        this._store
            .pipe(select(checkoutCouldHideLoader))
            .pipe(
                filter((couldHideLoader) => couldHideLoader),
                take(1)
            )
            .subscribe(() => {
                this._store.dispatch(pageDataFinishedLoading());
                scrollToTop();
            });
    }

    loginRequested(): void {
        this._window.location.href = this._translateService.instant(this.translateKey + 'LOGIN_LINK');
    }

    lookupNewRadioRequested(): void {
        this._activeSubscriptionModal.close();
        this._handleActiveSubscriptionModalClose();
    }

    onActiveSubscriptionModalClose(): void {
        this._handleActiveSubscriptionModalClose();
    }

    onStepChanged(stepId: PurchaseStepEnum): void {}

    private _handleActiveSubscriptionModalClose(): void {
        this.activeSubscriptionModalOpen = false;
        this._store.dispatch(ClearActiveSubscriptionFound());
        if (!!this.acRoute.snapshot?.params?.proactiveFlow) {
            this._store.dispatch(activeSubscriptionCloseRerouteToProactiveRtc());
        } else {
            this._store.dispatch(activeSubscriptionCloseRerouteToFlepz());
        }
    }

    private _buildDataLayerCustomerInfo(): void {
        this._store.dispatch(buildDataLayerCustomerInfo({ isFlepz: this.isFlepz }));
    }

    private _buildDataLayerPlanInfoProducts(): void {
        this._store.dispatch(buildDataLayerPlanInfoProducts({ isFlepz: this.isFlepz }));
    }

    continueToFallbackOffer() {
        this._store.dispatch(SetOfferNaAccepted({ payload: true }));
    }

    private _checkForStreamingOrganicScenario() {
        this.isStreamingOrganicScenario = this.isStreaming && this.isFlepz && !this.isStudentFlow;
    }

    trackSXMInTheCarPlusStreamingLink(): void {
        this._eventTrackService.track(DataLayerActionEnum.GetSxmInTheCarPlusStreaming, { componentName: ComponentNameEnum.Purchase });
    }

    trackNoRadioLink($event: Event): void {
        this._eventTrackService.track(DataLayerActionEnum.GetSxmOutsideTheCar, { componentName: ComponentNameEnum.Purchase });
    }

    navigateToOtherOffers() {
        this._store.dispatch(clearCheckoutStateRelatedData());
        this._store
            .select(getOtherPlansQueryParamsAndPath)
            .pipe(take(1))
            .subscribe((params) => {
                this.router.navigate([params.path], { queryParams: params.queryParams });
            });
    }
}
