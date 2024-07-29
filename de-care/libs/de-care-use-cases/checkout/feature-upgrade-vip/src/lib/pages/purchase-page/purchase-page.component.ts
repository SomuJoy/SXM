import { CdkStepper } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import {
    getFirstStepData,
    getErrorCode,
    selectAccountData,
    captureUserEnteredNewCard,
    captureUserSelectedUseCardOnFile,
    selectedPaymentMethodViewModel,
    clearPaymentInfo,
    LoadReviewDataWorkflowService,
    getOrderSummaryExtraData,
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
    DeviceType,
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
import { catchError, map, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { CreditCardUnexpectedError } from '@de-care/shared/de-microservices-common';
import { scrollToElementBySelector } from '@de-care/browser-common';
import { Router } from '@angular/router';
import { SxmUiNucaptchaComponent } from '@de-care/shared/sxm-ui/ui-nucaptcha';

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
    selector: 'de-care-purchase-page',
    templateUrl: './purchase-page.component.html',
    styleUrls: ['./purchase-page.component.scss'],
})
export class PurchasePageComponent implements AfterViewInit, OnDestroy {
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureUpgradeVipModule.PurchasePageComponent.';
    offer$ = this._store.pipe(select(getLeadOfferViewModel));
    errorCode$ = this._store.pipe(select(getErrorCode));
    selectAccount$ = this._store.pipe(select(selectAccountData));
    paymentInfoInactiveStep$ = this._store.pipe(select(selectedPaymentMethodViewModel));
    reviewDataLoadIsProcessing = false;
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
    offerDetails$ = this._store.pipe(select(getOfferDetails));
    displayNucaptcha$ = this._store.pipe(select(getDisplayNucaptcha));
    captchaAnswerWrong = false;
    captchaAnswer: { answer: string };
    @ViewChild('stepper') private _stepper: CdkStepper;
    @ViewChild('nuCaptcha', { static: false }) private _nucaptchaComponent: SxmUiNucaptchaComponent;
    firstStepData$ = this._store.pipe(select(getFirstStepData));

    currentLang$ = this._translateService.onLangChange.pipe(
        takeUntil(this._destroy$),
        map((ev) => ev.lang)
    );

    currentLangIsFrench$ = this.currentLang$.pipe(map((lang) => lang === LANGUAGE_CODES.FR_CA));
    selectedDevicesViewModel$ = this._store.pipe(select(selectedDevicesViewModel));

    serviceError = false;
    agreementAccepted = false;
    submitted = false;
    showPaymentOptions = true;

    constructor(
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _translateService: TranslateService,
        private readonly _loadReviewDataWorkflowService: LoadReviewDataWorkflowService,
        private readonly _processCompleteOrderStatusWorkflowService: ProcessCompleteOrderStatusWorkflowService,
        private readonly _vipValidateNucaptchaWorkflowService: VipValidateNucaptchaWorkflowService
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

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventReactionCustomerInfoAuthenticationType({ authenticationType: 'TOKEN_URL' }));
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'YourRadios' }));
    }

    onFirstStepContinue(selectedSecondRadio?: DeviceType) {
        if (selectedSecondRadio?.isJustFound === true) {
            this.showPaymentOptions = false;
        } else {
            this.showPaymentOptions = true;
        }
        this._store.dispatch(setSecondDevice({ device: selectedSecondRadio?.device }));
        this._store.dispatch(captureUserSelectedSecondDevice({ device: selectedSecondRadio?.device }));
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
        this.reviewDataLoadIsProcessing = true;
        this._loadReviewDataWorkflowService.build().subscribe(() => {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Review' }));
            this._moveToNextStepAndFixScroll();
            this.reviewDataLoadIsProcessing = false;
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
                tap(([_, { secondDevice, selectedStreamingAccount }]) => {
                    if (secondDevice || selectedStreamingAccount) {
                        this._router.navigateByUrl('subscribe/upgrade-vip/upgrading-devices');
                    } else {
                        this._router.navigateByUrl('/subscribe/upgrade-vip/thanks');
                    }
                }),
                catchError((error) => {
                    if (error === 'CREDIT_CARD_FAILURE' || error instanceof CreditCardUnexpectedError) {
                        this._handleUnexpectedCCError();
                    } else {
                        this._router.navigateByUrl('subscribe/upgrade-vip/upgrading-devices');
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
