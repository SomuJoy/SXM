import { AfterViewInit, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    CreateAccountError,
    CreateAccountWorkflowService,
    CreateAccountWorkflowStatus,
    getOrderQuoteData,
    getTotalNumberOfSteps,
    setCreateAccountError,
    setProvinceSelectorDisabled,
    setReviewStepCompleted,
    TrialActivationRTPValidateNucaptchaWorkflowService,
    getDisplayNucaptcha,
    getOfferInfoDetailsViewModel,
} from '@de-care/de-care-use-cases/trial-activation/rtp/state-shared';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getLanguage } from '@de-care/domains/customer/state-locale';
import { behaviorEventErrorFromUserInteraction, behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { getFeatureFlagEnableQuoteSummary } from '@de-care/shared/state-feature-flags';
import { select, Store } from '@ngrx/store';
import { SxmUiNucaptchaComponent } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { tap, catchError, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'de-care-trial-activation-rtp-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit, AfterViewInit {
    @HostBinding('attr.data-e2e') dataE2e = 'TrialActivationRtpReviewComponent';

    translateKey = 'deCareUseCasesTrialActivationRtpFeatureReviewModule.reviewComponent';
    agreementAccepted = false;
    submitted = false;
    isLoading = false;
    offerDetails$ = this._store.pipe(select(getOfferInfoDetailsViewModel));
    enableQuoteSummaryFeatureToggle$ = this._store.pipe(select(getFeatureFlagEnableQuoteSummary));
    orderQuoteData$ = this._store.pipe(select(getOrderQuoteData));
    currenctLang$ = this._store.pipe(select(getLanguage));
    numberOfSteps$ = this._store.pipe(select(getTotalNumberOfSteps));

    displayNucaptcha$ = this._store.pipe(select(getDisplayNucaptcha));
    captchaAnswerWrong = false;
    captchaAnswer: { answer: string };
    @ViewChild('nuCaptcha', { static: false }) private _nucaptchaComponent: SxmUiNucaptchaComponent;

    constructor(
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _createAccountWorkflowService: CreateAccountWorkflowService,
        private readonly _trialActivationRtpValidateNucaptchaWorkflowService: TrialActivationRTPValidateNucaptchaWorkflowService
    ) {}

    ngOnInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(setProvinceSelectorDisabled());
    }

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'CHECKOUT', componentKey: 'review' }));
    }

    onConfirmReviewAndSubmit(event) {
        event.preventDefault();
        this.submitted = true;
        this.captchaAnswerWrong = false;
        const captchaToken = this._nucaptchaComponent?.getCaptchaToken();

        if (this.agreementAccepted) {
            this.isLoading = true;

            const completeOrderObs$ = this._createAccountWorkflowService.build().pipe(
                take(1),
                tap(
                    (response) => {
                        if (response === CreateAccountWorkflowStatus.success) {
                            this._store.dispatch(setReviewStepCompleted());
                            this._router.navigateByUrl('/activate/trial/rtp/thanks');
                        } else if (response === CreateAccountWorkflowStatus.creditCardError) {
                            this._store.dispatch(setCreateAccountError({ createAccountError: CreateAccountError.creditCard }));
                            this._router.navigateByUrl('/activate/trial/rtp');
                        } else {
                            this._router.navigateByUrl('/error');
                        }
                    },
                    catchError((error) => {
                        this._router.navigateByUrl('/error');
                        return of(null);
                    })
                )
            );

            if (captchaToken) {
                this._trialActivationRtpValidateNucaptchaWorkflowService
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
                            this.isLoading = false;
                            return of(null);
                        })
                    )
                    .subscribe();
            } else {
                completeOrderObs$.subscribe();
            }
        } else {
            this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Checkout - Credit Card Agreement not selected' }));
        }
    }

    gotCaptcha() {
        this.captchaAnswer = null;
    }
}
