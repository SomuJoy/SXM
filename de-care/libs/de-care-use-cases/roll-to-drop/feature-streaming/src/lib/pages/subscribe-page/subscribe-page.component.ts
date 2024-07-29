import { getIsCanadaMode, setProvinceSelectionVisibleIfCanada } from '@de-care/domains/customer/state-locale';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
    AccountModel,
    OfferNotAvailableReasonEnum,
    generateEmptyAccount,
    convertAccountToAccountModel,
    getActivePlansOnAccount,
    PlanModel,
    DataLayerActionEnum,
    ComponentNameEnum,
} from '@de-care/data-services';
import { accountPlanTypeIsTrial } from '@de-care/domains/account/state-account';
import { HeroTitleTypeEnum } from '@de-care/domains/offers/ui-hero';
import {
    getFollowOnOptionSelected,
    SubmitTrialWithFollowOnOrderWorkflowService,
    SubmitTrialOnlyOrderWorkflowService,
    LoadRtdOffersForCustomerWorkflowService,
    getLangPrefAndOfferNotAvailableReason,
    rollToDropStreamingVM,
    TrialValidateNucaptchaWorkflowService,
} from '@de-care/de-care-use-cases/roll-to-drop/state-streaming';

import { CdkStepper } from '@angular/cdk/stepper';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, take, filter, delay, tap, map, concatMap, catchError, switchMap, skip } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NormalizeLangPrefHelperService } from '@de-care/app-common';
import { CoreLoggerService, SharedEventTrackService } from '@de-care/data-layer';
import { behaviorEventImpressionForComponent, behaviorEventImpressionForPageFlowName } from '@de-care/shared/state-behavior-events';
import { scrollToElementBySelector } from '@de-care/browser-common';
import { AccountLookupFormComponent, AccountLookupFormComponentApi, AccountLookupStepComplete } from '@de-care/identification';
import { CreditCardUnexpectedError, PasswordUnexpectedError } from '@de-care/shared/de-microservices-common';
import { getFeatureFlagEnableQuoteSummary } from '@de-care/shared/state-feature-flags';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getAccountSessionInfo } from '@de-care/domains/account/state-session-data';
import {
    CheckIfRTDStreamingPlanCodeIsEligibleWorkflowService,
    clearPaymentInfo,
    getFollowOnData,
    getOfferDataWithStreaming,
    getOrderSummaryData,
    RTDAccountInfo,
    RTDPaymentInfo,
    setAccountInfo,
    setOfferNotAvailable,
    setPaymentInfo,
    getShowFollowOnSelection,
    LoadReviewOrderWorkflowService,
    getDisplayNucaptcha,
    getMaskedEmail,
    getIsStudentOffer,
} from '@de-care/de-care-use-cases/roll-to-drop/state-shared';
import { EnterYourInformationComponentApi } from '@de-care/de-care-use-cases/roll-to-drop/ui-shared';
import { SxmUiNucaptchaComponent } from '@de-care/shared/sxm-ui/ui-nucaptcha';

@Component({
    selector: 'de-care-subscribe-page',
    templateUrl: './subscribe-page.component.html',
    styleUrls: ['./subscribe-page.component.scss'],
})
export class SubscribePageComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('stepper') private readonly _stepper: CdkStepper;
    @ViewChild('enterYourInfoStep') private readonly _enterYourInformationComponentApi: EnterYourInformationComponentApi;
    @ViewChild(AccountLookupFormComponent) accountLookupFormComponent: AccountLookupFormComponentApi;
    translateKeyPrefix = 'deCareUseCasesRollToDropFeatureStreaming.rollToDropPageComponent';

    attemptedEmail: string;
    closeVerifyAccountModal$ = new Subject<boolean>();
    account: AccountModel;
    isStreaming: boolean;
    ccError = false;
    passwordError = false;

    followOnOptionSelected$ = this._store.pipe(select(getFollowOnOptionSelected));
    followOnOptionSelected: boolean;

    followOnData$ = this._store.pipe(select(getFollowOnData));
    showFollowOnOption$ = this._store.select(getShowFollowOnSelection);
    prefilledSessionCustomerData$ = this._store.pipe(
        select(getAccountSessionInfo),
        map(({ firstName, lastName, zipCode: postalCode }) => ({
            firstName,
            lastName,
            postalCode,
        }))
    );
    enableQuoteSummaryFeatureToggle$ = this._store.pipe(select(getFeatureFlagEnableQuoteSummary));

    langPref: string;
    programCode: string;
    promoCode: string;
    offerNotAvailableReason: OfferNotAvailableReasonEnum;

    isLoading$ = new BehaviorSubject<boolean>(false);
    offerData$ = this._store.pipe(select(getOfferDataWithStreaming));
    vm$ = this._store.pipe(select(rollToDropStreamingVM));
    orderSummaryData$ = this._store.pipe(select(getOrderSummaryData));
    heroTitleType$ = this._store.pipe(
        select(getIsStudentOffer),
        map((isStudent) => (isStudent ? HeroTitleTypeEnum.StudentPlan : HeroTitleTypeEnum.Streaming))
    );

    agreementAccepted = false;
    orderSubmitted = false;
    showSxmInTheCarPlusStreamingLink = false;
    reducedFields = false;

    checkoutPage = 'CHECKOUT';
    authenticatePage = 'AUTHENTICATE';

    displayIneligibleLoader$ = new BehaviorSubject(false);

    displayNucaptcha$ = this._store.pipe(select(getDisplayNucaptcha));
    captchaAnswerWrong = false;
    captchaAnswer: { answer: string };

    @ViewChild('nuCaptcha', { static: false }) private _nucaptchaComponent: SxmUiNucaptchaComponent;

    private _destroy$ = new Subject<boolean>();

    private _logPrefix: string = '[Subscribe Page]:';

    constructor(
        private readonly _store: Store,
        private readonly _translateService: TranslateService,
        private readonly _activateRoute: ActivatedRoute,
        private readonly _router: Router,
        private readonly _normalizeLangPrefHelperService: NormalizeLangPrefHelperService,
        private readonly _loadReviewOrderWorkflowService: LoadReviewOrderWorkflowService,
        private readonly _submitTrialWithFollowOnOrderWorkflowService: SubmitTrialWithFollowOnOrderWorkflowService,
        private readonly _submitTrialOnlyOrderWorkflowService: SubmitTrialOnlyOrderWorkflowService,
        private readonly _logger: CoreLoggerService,
        private readonly _loadRtdOffersForCustomerWorkflowService: LoadRtdOffersForCustomerWorkflowService,
        private readonly _checkIfRTDStreamingPlanCodeisEligibleWorkflowService: CheckIfRTDStreamingPlanCodeIsEligibleWorkflowService,
        private readonly _trialValidateNucaptchaWorkflowService: TrialValidateNucaptchaWorkflowService,
        private _eventTrackService: SharedEventTrackService
    ) {}

    ngOnInit() {
        this._store.dispatch(setProvinceSelectionVisibleIfCanada({ isVisible: true }));

        this._store.pipe(select(getLangPrefAndOfferNotAvailableReason), take(1)).subscribe(({ langPref, offerNotAvailableReason }) => {
            this.langPref = langPref ? langPref : '';
            this.offerNotAvailableReason = offerNotAvailableReason ? offerNotAvailableReason : null;
        });
        this._listenForLangChange();
        this._listenForFollowOnOptionSelected();
        this._store.pipe(select(getIsCanadaMode), take(1)).subscribe((isCanadaMode) => (this.showSxmInTheCarPlusStreamingLink = this.reducedFields = !isCanadaMode));
        this._store.dispatch(pageDataFinishedLoading());
    }

    ngAfterViewInit(): void {
        this._activateRoute.queryParams
            .pipe(
                filter((params) => params['hasAccount']),
                delay(1),
                take(1)
            )
            .subscribe(() => this._doAccountLookup());
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    handleAccountLoadedForSubscription($event): void {
        if ($event.payload) {
            this.account = convertAccountToAccountModel($event.payload);
            const activePlans: PlanModel[] = getActivePlansOnAccount(this.account);
            if (activePlans && activePlans[0] && accountPlanTypeIsTrial(activePlans[0].type)) {
                //Trial plan may not have Trial/RTD follow-on plans
                this._store.dispatch(setOfferNotAvailable({ offerNotAvailableReason: OfferNotAvailableReasonEnum.OTHERS }));
            }
        }
    }

    handleAccountLookupStepComplete(accountLookupData: AccountLookupStepComplete): void {
        if (accountLookupData && accountLookupData.emailValid) {
            if (accountLookupData.accountData && accountLookupData.accountData.length > 0) {
                this._router.navigate(['/subscribe/checkout/purchase/streaming/generic-error']);
            }

            this._loadRtdOffersForCustomerWorkflowService.build().subscribe(() => {
                this.attemptedEmail = accountLookupData.attemptedEmail;
                this.account = generateEmptyAccount();
                this.account.customerInfo.email = this.attemptedEmail;
                this._gotToNextStep();
            });
        }
    }

    handleSubscribeLinkClicked($event): void {
        //ToDo
    }

    stepEditClicked($event): void {
        this._store.dispatch(setProvinceSelectionVisibleIfCanada({ isVisible: true }));
        //ToDo: Implement for events
    }

    onAccountLookupStepActive() {
        if (this._enterYourInformationComponentApi) {
            this._enterYourInformationComponentApi.clearForm();
        }
        this._store.dispatch(behaviorEventImpressionForPageFlowName({ flowName: this.authenticatePage }));
        this._trackPage('AccountLookup');
    }

    onYourInfoStepActive() {
        this._store.dispatch(behaviorEventImpressionForPageFlowName({ flowName: this.checkoutPage }));
        this._trackPage(this.followOnOptionSelected ? 'paymentInfo' : 'customerInfo');
    }

    onReviewStepActive() {
        this._trackPage('Review');
        this._store.dispatch(setProvinceSelectionVisibleIfCanada({ isVisible: false }));
    }

    continueToFallbackOffer() {
        //Forwarded to checkout streaming flow for default streaming offer.
        this._router.navigate(['subscribe', 'checkout', 'streaming']);
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
                const rtdAddress = accountInfoData?.serviceAddress;
                if (this.reducedFields) {
                    paymentInfoData.billingAddress = { city: rtdAddress?.city, state: rtdAddress?.state, country: rtdAddress?.country, zip: rtdAddress?.zip };
                }
                this._store.dispatch(setPaymentInfo({ paymentInfo: paymentInfoData }));
            } else {
                this._store.dispatch(clearPaymentInfo());
            }
        }
    }

    handleNotEnteredPaymentInfo(): void {
        this.isLoading$.next(true);
        this._store.dispatch(clearPaymentInfo());

        this._runEligiblity()
            .pipe(
                filter((eligible) => eligible),
                concatMap(() => this._submitTrialOnlyOrderWorkflowService.build())
            )
            .subscribe(
                () => {
                    this._redirectToConfirmationPage();
                    this.isLoading$.next(false);
                },
                (error) => {
                    if (error instanceof PasswordUnexpectedError) {
                        this._handlePasswordError();
                    }
                    this.isLoading$.next(false);
                    return of(null);
                }
            );
    }

    onReviewAndSubmit(event) {
        event.preventDefault();
        this.isLoading$.next(true);
        this.orderSubmitted = true;
        this.captchaAnswerWrong = false;
        const captchaToken = this._nucaptchaComponent?.getCaptchaToken();
        if (this.agreementAccepted && (!captchaToken || this.captchaAnswer)) {
            const completeOrderObs$ = this._submitTrialWithFollowOnOrderWorkflowService.build();

            if (captchaToken) {
                this._trialValidateNucaptchaWorkflowService
                    .build({
                        token: captchaToken,
                        answer: this.captchaAnswer.answer,
                    })
                    .pipe(
                        switchMap((validCaptcha) => {
                            if (validCaptcha) {
                                return completeOrderObs$;
                            }
                            this.captchaAnswerWrong = true;
                            return of(null);
                        })
                    )
                    .subscribe(
                        () => {
                            this._redirectToConfirmationPage();
                            this.isLoading$.next(false);
                        },
                        (error) => {
                            this._handleError(error);
                            this.isLoading$.next(false);
                        }
                    );
            } else {
                completeOrderObs$.subscribe(
                    () => this._redirectToConfirmationPage(),
                    (error) => this._handleError(error)
                );
            }
        }
    }

    private _handleError(error) {
        if (error instanceof CreditCardUnexpectedError) {
            this._handleUnexpectedCCError();
        }
        if (error instanceof PasswordUnexpectedError) {
            this._handlePasswordErrorWithFollowOn();
        }
        return of(null);
    }

    handleEnteredPaymentInfo(): void {
        this.isLoading$.next(true);
        this._runEligiblity()
            .pipe(
                filter((eligible) => eligible),
                concatMap(() =>
                    this._loadReviewOrderWorkflowService.build().pipe(catchError((error) => of(error instanceof CreditCardUnexpectedError && this._handleUnexpectedCCError())))
                )
            )
            .subscribe(() => {
                this._gotToNextStep();
                this.isLoading$.next(false);
            });
    }

    private _doAccountLookup() {
        this._store
            .pipe(
                select(getMaskedEmail),
                filter((email) => !!email),
                take(1)
            )
            .subscribe((email) => {
                this.attemptedEmail = email;
                this.accountLookupFormComponent.doLookup(email);
            });
    }

    private _handleIneligibleOfferScenario(): void {
        this.displayIneligibleLoader$
            .pipe(
                filter((shouldDisplay) => shouldDisplay),
                take(1),
                delay(5000),
                concatMap(() => from(this._router.navigate(['subscribe/checkout/streaming'], { queryParams: { ineligibleForOffer: true } })))
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

    private _handlePasswordError(): void {
        this.passwordError = true;
        this.ccError = false;
        scrollToElementBySelector('login-form-fields');
    }

    private _handlePasswordErrorWithFollowOn(): void {
        this.passwordError = true;
        this.ccError = false;
        this._stepper.previous();
        scrollToElementBySelector('login-form-fields');
    }

    private _handleUnexpectedCCError(): void {
        this.ccError = true;
        this.passwordError = false;
        this._stepper.previous();
        scrollToElementBySelector('cc-form-fields');
    }

    private _redirectToConfirmationPage(): void {
        this._router.navigate(['subscribe', 'trial', 'streaming', 'thanks']);
    }

    private _listenForLangChange(): void {
        this._translateService.onLangChange.pipe(takeUntil(this._destroy$)).subscribe((langChangeEvent) => {
            this.langPref = this._normalizeLangPrefHelperService.getLangKey(langChangeEvent.lang);
        });
    }

    private _listenForFollowOnOptionSelected(): void {
        /* since the ui component is using the store, we dont have control here,
           so we need to skip first one which is fired at the beginning of the flow
        */
        this.followOnOptionSelected$.pipe(takeUntil(this._destroy$), distinctUntilChanged(), skip(1)).subscribe((followOnOptionSelected) => {
            this.followOnOptionSelected = followOnOptionSelected;
            this._trackPage(this.followOnOptionSelected ? 'paymentInfo' : 'customerInfo');
        });
    }

    private _trackPage(componentKey: string): void {
        const page = componentKey === 'AccountLookup' ? this.authenticatePage : this.checkoutPage;
        this._store.dispatch(
            behaviorEventImpressionForComponent({
                componentName: componentKey,
            })
        );
    }

    private _gotToNextStep() {
        this._stepper.next();
        scrollToElementBySelector('sxm-ui-accordion-stepper .active');
    }

    setCCError(event: boolean): void {
        this.ccError = event;
    }

    trackSXMInTheCarPlusStreamingLink(): void {
        this._eventTrackService.track(DataLayerActionEnum.GetSxmInTheCarPlusStreaming, { componentName: ComponentNameEnum.Purchase });
    }

    gotCaptcha() {
        this.captchaAnswer = null;
    }
}
