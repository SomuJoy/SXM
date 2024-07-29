import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CdkStepper } from '@angular/cdk/stepper';
import { select, Store } from '@ngrx/store';
import { ComponentNameEnum, DataLayerActionEnum, OfferNotAvailableReasonEnum, generateEmptyAccount, AccountModel } from '@de-care/data-services';
import {
    clearPaymentInfo,
    getFollowOnData,
    getOfferDataWithStreaming,
    getOrderSummaryData,
    RTDAccountInfo,
    RTDPaymentInfo,
    setAccountInfo,
    setPaymentInfo,
    getShowFollowOnSelection,
    CheckIfRTDStreamingPlanCodeIsEligibleWorkflowService,
    getYourInfoDataLoadIsProcessing,
    setLoadYourInfoDataAsNotProcessing,
} from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { HeroTitleTypeEnum } from '@de-care/domains/offers/ui-hero';
import { getFeatureFlagEnableQuoteSummary } from '@de-care/shared/state-feature-flags';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { CreditCardUnexpectedError } from '@de-care/shared/de-microservices-common';
import { scrollToElementBySelector } from '@de-care/browser-common';
import { getIsCanadaMode, setProvinceSelectionVisibleIfCanada } from '@de-care/domains/customer/state-locale';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { CoreLoggerService, SharedEventTrackService } from '@de-care/data-layer';
import {
    getFollowOnOptionSelected,
    getLangPrefAndOfferNotAvailableReason,
    getSubmitOrderIsProcessing,
    rollToDropStreamingTokenizedVM,
    SubmitTrialWithFollowOnOrderWorkflowService,
    getMaskedUserNameFromToken,
    setFollowOnOptionNotSelected,
    setFollowOnOptionSelected,
    SubmitTrialOnlyOrderTokenizedWorkflowService,
    LoadReviewOrderTokenizedWorkflowService,
} from '@de-care/de-care-use-cases/roll-to-drop/state-streaming-tokenized';
import { catchError, concatMap, delay, distinctUntilChanged, filter, map, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { TranslateService } from '@ngx-translate/core';
import { NormalizeLangPrefHelperService } from '@de-care/app-common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
class SubscribeForm extends FormGroup {
    readonly password = this.get('password') as FormControl;
    readonly followOnSelected = this.get('followOnSelected') as FormControl;

    constructor(readonly fb: FormBuilder) {
        super(
            fb.group({
                password: [],
                followOnSelected: [false],
            }).controls
        );
    }
}

@Component({
    selector: 'de-care-subscribe-page',
    templateUrl: './subscribe-page.component.html',
    styleUrls: ['./subscribe-page.component.scss'],
})
export class SubscribePageComponent implements OnInit, OnDestroy {
    @ViewChild('stepper') private readonly _stepper: CdkStepper;
    maskedEmail$ = this._store.select(getMaskedUserNameFromToken);
    offerData$ = this._store.pipe(select(getOfferDataWithStreaming));
    followOnOptionSelected$ = this._store.pipe(select(getFollowOnOptionSelected));
    orderSummaryData$ = this._store.pipe(select(getOrderSummaryData));
    submitOrderIsProcessing$ = this._store.pipe(select(getSubmitOrderIsProcessing));
    vm$ = this._store.pipe(select(rollToDropStreamingTokenizedVM));
    enableQuoteSummaryFeatureToggle$ = this._store.pipe(select(getFeatureFlagEnableQuoteSummary));
    followOnData$ = this._store.pipe(select(getFollowOnData));
    displayIneligibleLoader$ = new BehaviorSubject(false);
    showFollowOnOption$ = this._store.select(getShowFollowOnSelection);
    maskedUserNameFromToken$ = this._store.select(getMaskedUserNameFromToken);
    reviewOrderDataLoadIsProcessing$ = this._store.pipe(select(getYourInfoDataLoadIsProcessing));

    account: AccountModel;
    form: SubscribeForm;
    submitted = false;
    offerNotAvailableReason: OfferNotAvailableReasonEnum;
    heroTitleType: HeroTitleTypeEnum = HeroTitleTypeEnum.Streaming;
    showSxmInTheCarPlusStreamingLink = false;
    orderSubmitted = false;
    agreementAccepted = false;
    ccError = false;
    isFollowOnChecked = false;
    displayPaymentForm = false;
    followOnOptionSelected: boolean;
    langPref: string;
    translateKeyPrefix = 'deCareUseCasesRollToDropFeatureStreamingTokenized.subscribePageComponent';

    private _destroy$ = new Subject<boolean>();
    private _logPrefix = '[Subscribe Page]:';

    constructor(
        private readonly _store: Store,
        private readonly _router: Router,
        private _eventTrackService: SharedEventTrackService,
        private readonly _translateService: TranslateService,
        private readonly _logger: CoreLoggerService,
        private readonly _normalizeLangPrefHelperService: NormalizeLangPrefHelperService,
        private readonly _loadReviewOrderTokenizedWorkflowService: LoadReviewOrderTokenizedWorkflowService,
        private readonly _submitTrialOnlyOrderTokenizedWorkflowService: SubmitTrialOnlyOrderTokenizedWorkflowService,
        private readonly _submitTrialWithFollowOnOrderWorkflowService: SubmitTrialWithFollowOnOrderWorkflowService,
        private readonly _checkIfRTDStreamingPlanCodeisEligibleWorkflowService: CheckIfRTDStreamingPlanCodeIsEligibleWorkflowService,
        private readonly _fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.account = generateEmptyAccount();
        this._store.dispatch(setProvinceSelectionVisibleIfCanada({ isVisible: true }));

        this._store.pipe(select(getLangPrefAndOfferNotAvailableReason), take(1)).subscribe(({ langPref, offerNotAvailableReason }) => {
            this.langPref = langPref ? langPref : '';
            this.offerNotAvailableReason = offerNotAvailableReason ? offerNotAvailableReason : null;
        });
        this._listenForLangChange();
        this._listenForFollowOnOptionSelected();
        this._store.pipe(select(getIsCanadaMode), take(1)).subscribe((isCanadaMode) => (this.showSxmInTheCarPlusStreamingLink = !isCanadaMode));
        this._store.dispatch(pageDataFinishedLoading());
        this.form = new SubscribeForm(this._fb);
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    continueToFallbackOffer() {
        //Forwarded to checkout streaming flow for default streaming offer.
        this._router.navigate(['subscribe', 'checkout', 'streaming']);
    }

    onReviewStepActive() {
        this._trackPage('Review');
        this._store.dispatch(setProvinceSelectionVisibleIfCanada({ isVisible: false }));
    }

    stepEditClicked($event): void {
        this._store.dispatch(setProvinceSelectionVisibleIfCanada({ isVisible: true }));
        //ToDo: Implement for events
    }

    trackSXMInTheCarPlusStreamingLink(): void {
        this._eventTrackService.track(DataLayerActionEnum.GetSxmInTheCarPlusStreaming, { componentName: ComponentNameEnum.Purchase });
    }

    onFollowOnCheckedClick(isChecked: boolean): void {
        this.isFollowOnChecked = isChecked;
        this.displayPaymentForm = isChecked;
        this._store.dispatch(isChecked ? setFollowOnOptionSelected() : setFollowOnOptionNotSelected());
    }

    setCCError(event: boolean): void {
        this.ccError = event;
    }

    handleYourInfo($event: any): void {
        if ($event) {
            //ToDo: Validate customer info
            const accountInfoData: RTDAccountInfo = $event.accountInfo;
            const paymentInfoData: RTDPaymentInfo = $event.paymentInfo;
            this._logger.debug(`${this._logPrefix} payment info data: `, paymentInfoData);

            if (accountInfoData) {
                this._store.dispatch(setAccountInfo({ accountInfo: accountInfoData }));
            }

            if (paymentInfoData) {
                this._store.dispatch(setPaymentInfo({ paymentInfo: paymentInfoData }));
            } else {
                this._store.dispatch(clearPaymentInfo());
            }
        }

        this.form.markAllAsTouched();
    }

    handleNotEnteredPaymentInfo(): void {
        if (this.form.invalid) {
            this._store.dispatch(setLoadYourInfoDataAsNotProcessing());
            return;
        }

        this._store.dispatch(clearPaymentInfo());

        const password = this.form.get('password').value;

        this._runEligiblity()
            .pipe(
                withLatestFrom(this.maskedUserNameFromToken$),
                filter(([eligible]) => eligible),
                concatMap(([_, login]) => this._submitTrialOnlyOrderTokenizedWorkflowService.build({ login, password })),
                take(1)
            )
            .subscribe(() => this._redirectToConfirmationPage());
    }

    handleEnteredPaymentInfo(): void {
        if (this.form.invalid) {
            this._store.dispatch(setLoadYourInfoDataAsNotProcessing());
            return;
        }

        this._runEligiblity()
            .pipe(
                filter((eligible) => eligible),
                concatMap(() =>
                    this._loadReviewOrderTokenizedWorkflowService
                        .build()
                        .pipe(catchError((error) => of(error instanceof CreditCardUnexpectedError && this._handleUnexpectedCCError())))
                ),
                take(1)
            )
            .subscribe(() => this._goToNextStep());
    }

    onReviewAndSubmit(event) {
        event.preventDefault();
        const password = this.form.get('password').value;
        this.orderSubmitted = true;
        if (this.agreementAccepted) {
            this.maskedUserNameFromToken$
                .pipe(
                    concatMap((login) =>
                        this._submitTrialWithFollowOnOrderWorkflowService
                            .build({ login, password })
                            .pipe(catchError((error) => of(error instanceof CreditCardUnexpectedError && this._handleUnexpectedCCError())))
                    ),
                    take(1)
                )
                .subscribe((_) => this._redirectToConfirmationPage());
        }
    }

    private _handleIneligibleOfferScenario(): void {
        this.displayIneligibleLoader$
            .pipe(
                filter((shouldDisplay) => shouldDisplay),
                take(1),
                delay(5000),
                tap(() => this._router.navigate(['subscribe/checkout/streaming'], { queryParams: { ineligibleForOffer: true } })),
                take(1)
            )
            .subscribe(() => this.displayIneligibleLoader$.next(false));
    }

    private _runEligiblity(): Observable<boolean> {
        this._handleIneligibleOfferScenario();

        return this._checkIfRTDStreamingPlanCodeisEligibleWorkflowService.build().pipe(
            tap((eligible) => this.displayIneligibleLoader$.next(!eligible)),
            map((eligible) => eligible)
        );
    }

    private _goToNextStep() {
        this._stepper.next();
        scrollToElementBySelector('sxm-ui-accordion-stepper .active');
    }

    private _listenForFollowOnOptionSelected(): void {
        this.followOnOptionSelected$.pipe(takeUntil(this._destroy$), distinctUntilChanged()).subscribe((followOnOptionSelected) => {
            this.followOnOptionSelected = followOnOptionSelected;
            this._trackPage(this.followOnOptionSelected ? 'paymentInfo' : 'customerInfo');
        });
    }

    private _listenForLangChange(): void {
        this._translateService.onLangChange.pipe(takeUntil(this._destroy$)).subscribe((langChangeEvent) => {
            this.langPref = this._normalizeLangPrefHelperService.getLangKey(langChangeEvent.lang);
        });
    }

    private _trackPage(componentKey: string): void {
        const page = componentKey === 'AccountLookup' ? 'AUTHENTICATE' : 'CHECKOUT';
        this._store.dispatch(
            behaviorEventImpressionForPage({
                pageKey: page,
                componentKey: componentKey,
            })
        );
    }

    private _redirectToConfirmationPage(): void {
        this._router.navigate(['subscribe', 'trial', 'streaming', 'tokenized', 'thanks']);
    }

    private _handleUnexpectedCCError(): void {
        this.ccError = true;
        this._stepper.previous();
        scrollToElementBySelector('cc-form-fields');
    }
}
