import { CdkStepper } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import {
    getFirstStepData,
    getErrorCode,
    selectAccountData,
    captureUserEnteredNewCard,
    captureUserSelectedUseCardOnFile,
    selectedPaymentMethodViewModel,
    clearPaymentInfo,
    LoadReviewDataWorkflowService,
    getReviewDataLoadIsProcessing,
    getOrderSummaryExtraData,
    Device,
    captureUserSelectedSecondDevice,
    selectedDevicesViewModel,
    getOrderSummaryData,
    ProcessCompleteOrderStatusWorkflowService,
    getCompleteOrderStatusIsProcesssing,
    setSecondDevice,
    getReviewOrderHeaderViewModelData,
    getHeroData,
    getOfferDescription,
    getOfferDetails,
    getDisplayNucaptcha,
    VipValidateNucaptchaWorkflowService,
    getLeadOfferViewModel,
    getAccountLookupStepData,
    DeviceType,
    lookupStepRequested,
    organicFirstStepFromRequested,
    captureUserSelectedStreamingPlan,
    setStreamingAccount,
} from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import {
    behaviorEventImpressionForPage,
    behaviorEventImpressionForComponent,
    behaviorEventReactionCustomerInfoAuthenticationType,
} from '@de-care/shared/state-behavior-events';
import { LANGUAGE_CODES } from '@de-care/shared/translation';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, of, Subject } from 'rxjs';
import { catchError, map, switchMap, take, takeUntil, tap, withLatestFrom, concatMap, skip, filter } from 'rxjs/operators';
import { CreditCardUnexpectedError } from '@de-care/shared/de-microservices-common';
import { scrollToElementBySelector } from '@de-care/browser-common';
import { Router } from '@angular/router';
import { SxmUiNucaptchaComponent } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { getSelectedProvince } from '@de-care/domains/customer/state-locale';
import { LoadOrganicDataWorkflowService } from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { pageDataFinishedLoading, pageDataStartedLoading } from '@de-care/de-care/shared/state-loading';
import { getIsCanadaMode } from '@de-care/shared/state-settings';

interface ListenOnModel {
    isActive: boolean;
    label: string;
}
interface PaymentInfoSubmission {
    paymentForm: {
        billingAddress: {
            addressLine1: string;
            city: string;
            state: string;
            zip: string;
        };
        ccExpDate: string;
        ccName: string;
        ccNum: string;
    };
    useCardOnFile: boolean;
}

@Component({
    selector: 'de-care-organic-page',
    templateUrl: './organic-page.component.html',
    styleUrls: ['./organic-page.component.scss'],
})
export class OrganicPageComponent implements AfterViewInit, OnDestroy, OnInit {
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeVipModule.OrganicPageComponent.';
    offer$ = this._store.pipe(select(getLeadOfferViewModel));
    errorCode$ = this._store.pipe(select(getErrorCode));
    selectAccount$ = this._store.pipe(select(selectAccountData));
    paymentInfoInactiveStep$ = this._store.pipe(select(selectedPaymentMethodViewModel));
    reviewDataLoadIsProcessing$ = this._store.pipe(select(getReviewDataLoadIsProcessing));
    orderSummaryData$ = this._store.pipe(select(getOrderSummaryData));
    orderSummaryExtraData$ = this._store.pipe(select(getOrderSummaryExtraData));
    completeOrderStatusIsProcesssing$ = this._store.pipe(select(getCompleteOrderStatusIsProcesssing));
    reviewHeaderViewModelData$ = this._store.pipe(select(getReviewOrderHeaderViewModelData));
    heroData$ = this._store.pipe(select(getHeroData));
    getOfferDescription$ = combineLatest(this._translateService.stream(`${this.translateKeyPrefix}IconLabels`), this._store.select(getOfferDescription)).pipe(
        map(([iconLabels, offerDescription]) => {
            return {
                ...offerDescription,
                icons: this._mapListeningOptionsToTextCopy(offerDescription.icons, iconLabels),
            };
        })
    );
    showPaymentOptions = true;
    offerDetails$ = this._store.pipe(select(getOfferDetails));
    displayNucaptcha$ = this._store.pipe(select(getDisplayNucaptcha));
    captchaAnswerWrong = false;
    captchaAnswer: { answer: string };
    @ViewChild('stepper') private _stepper: CdkStepper;
    @ViewChild('nuCaptcha', { static: false }) private _nucaptchaComponent: SxmUiNucaptchaComponent;
    firstStepData$ = this._store.pipe(select(getFirstStepData));
    accountLookupStepData$ = this._store.select(getAccountLookupStepData);

    currentLang$ = this._translateService.onLangChange.pipe(
        takeUntil(this._destroy$),
        map((ev) => ev.lang)
    );

    currentLangIsFrench$ = this.currentLang$.pipe(map((lang) => lang === LANGUAGE_CODES.FR_CA));
    selectedDevicesViewModel$ = this._store.pipe(select(selectedDevicesViewModel));

    serviceError = false;
    agreementAccepted = false;
    submitted = false;

    selectedProvince$ = this._store.pipe(select(getSelectedProvince));
    isCanadaMode$ = this._store.pipe(select(getIsCanadaMode));

    constructor(
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _translateService: TranslateService,
        private readonly _loadReviewDataWorkflowService: LoadReviewDataWorkflowService,
        private readonly _processCompleteOrderStatusWorkflowService: ProcessCompleteOrderStatusWorkflowService,
        private readonly _vipValidateNucaptchaWorkflowService: VipValidateNucaptchaWorkflowService,
        private readonly _loadOrganicDataWorkflowService: LoadOrganicDataWorkflowService
    ) {}

    private _moveToNextStepAndFixScroll() {
        this._stepper.next();
        this._scrollToActiveStep();
    }

    private _scrollToActiveStep() {
        setTimeout(() => scrollToElementBySelector('sxm-ui-accordion-stepper span.active'));
    }

    private _handleUnexpectedCCError(): void {
        this.serviceError = true;
        this._stepper.previous();
        this._scrollToActiveStep();
    }

    ngOnInit() {
        this.isCanadaMode$.pipe(take(1)).subscribe((isCanadaMode) => {
            if (isCanadaMode) {
                this._listenForProvince();
            }
        });
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'RID_ACCT' }));
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'Flepzsearch' }));
    }

    onFirstStepContinue(selectedSecondRadioOrStreaming?: DeviceType) {
        if (selectedSecondRadioOrStreaming?.isJustFound === true) {
            this.showPaymentOptions = false;
        } else {
            this.showPaymentOptions = true;
        }
        if (selectedSecondRadioOrStreaming?.streaming) {
            this._store.dispatch(setStreamingAccount({ streamingAccount: selectedSecondRadioOrStreaming?.streaming }));
            this._store.dispatch(captureUserSelectedStreamingPlan({ streaming: selectedSecondRadioOrStreaming?.streaming }));
        } else {
            this._store.dispatch(setSecondDevice({ device: selectedSecondRadioOrStreaming?.device }));
            this._store.dispatch(captureUserSelectedSecondDevice({ device: selectedSecondRadioOrStreaming?.device }));
        }
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'PaymentInfo' }));
        this._moveToNextStepAndFixScroll();
    }

    onPaymentFormComplete(paymentInfoSubmission: PaymentInfoSubmission): void {
        if (paymentInfoSubmission.paymentForm) {
            this._store.dispatch(
                captureUserEnteredNewCard({
                    paymentInfo: paymentInfoSubmission.paymentForm,
                })
            );
        } else {
            this._store.dispatch(clearPaymentInfo());
        }

        if (paymentInfoSubmission.useCardOnFile) {
            this._store.dispatch(
                captureUserSelectedUseCardOnFile({
                    paymentInfo: paymentInfoSubmission.paymentForm,
                })
            );
        }

        this._loadReviewDataWorkflowService.build().subscribe(() => {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Review' }));
            this._moveToNextStepAndFixScroll();
        });
        this.serviceError = false;
    }

    onConfirmReviewAndSubmit(event: Event) {
        event.preventDefault();
        this.submitted = true;
        this.captchaAnswerWrong = false;
        const captchaToken = this._nucaptchaComponent?.getCaptchaToken();
        if (this.agreementAccepted && (!captchaToken || this.captchaAnswer?.answer)) {
            const completeOrderObs$ = this._processCompleteOrderStatusWorkflowService.build().pipe(
                withLatestFrom(this.selectedDevicesViewModel$),
                take(1),
                tap(([, { secondDevice, selectedStreamingAccount }]) => {
                    if (secondDevice || selectedStreamingAccount) {
                        this._router.navigateByUrl('/subscribe/upgrade-vip/upgrading-devices');
                    } else {
                        this._router.navigateByUrl('/subscribe/upgrade-vip/thanks');
                    }
                }),
                catchError((error) => {
                    if (error === 'CREDIT_CARD_FAILURE' || error instanceof CreditCardUnexpectedError) {
                        this._handleUnexpectedCCError();
                    } else {
                        this._router.navigateByUrl('/subscribe/upgrade-vip/upgrading-devices');
                    }
                    return of(null);
                })
            );

            if (captchaToken) {
                this._vipValidateNucaptchaWorkflowService
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
                    .subscribe();
            } else {
                completeOrderObs$.subscribe();
            }
        }
    }

    gotCaptcha() {
        this.captchaAnswer = null;
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    onAccountLookupContinue() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'YourRadios' }));
        this._moveToNextStepAndFixScroll();
    }

    onEditLookupStep() {
        this._store.dispatch(lookupStepRequested());
    }

    onFirstStepFormActive() {
        this._store.dispatch(organicFirstStepFromRequested());
    }

    private _listenForProvince(): void {
        combineLatest([this.selectedProvince$, this.accountLookupStepData$])
            .pipe(
                takeUntil(this._destroy$),
                skip(1),
                filter(([province, account]) => !account.currentRadioId),
                concatMap(([province, account]) => {
                    this._store.dispatch(pageDataStartedLoading());
                    return this._loadOrganicDataWorkflowService.build(province).pipe(
                        map(() => {
                            this._store.dispatch(pageDataFinishedLoading());
                            return true;
                        }),
                        catchError((error) => {
                            this._store.dispatch(pageDataFinishedLoading());
                            return of(this._router.createUrlTree(['/subscribe/upgrade-vip/error']));
                        })
                    );
                })
            )
            .subscribe();
    }

    private _mapListeningOptionsToTextCopy(icons: { inside: ListenOnModel; outside: ListenOnModel; pandora: ListenOnModel; perks?: ListenOnModel }, iconLabels: any) {
        {
            return {
                ...icons,
                inside: {
                    isActive: icons.inside.isActive,
                    label: iconLabels.SATELLITE,
                },
                outside: {
                    isActive: icons.outside.isActive,
                    label: iconLabels.STREAMING,
                },
                pandora: {
                    isActive: icons.pandora.isActive,
                    label: iconLabels.PANDORA,
                },
                perks: {
                    isActive: icons.perks.isActive,
                    label: iconLabels.PERKS,
                },
            };
        }
    }
}
