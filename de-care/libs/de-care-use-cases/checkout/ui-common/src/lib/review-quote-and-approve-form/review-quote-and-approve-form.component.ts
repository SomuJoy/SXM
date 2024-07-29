import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { behaviorEventErrorsFromUserInteraction } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { SharedSxmUiUiNucaptchaModule, SxmUiNucaptchaComponent } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { ValidateNucaptchaWorkflowService } from '@de-care/domains/utility/state-nucaptcha';
import { getIsClosedRadio } from '@de-care/domains/account/state-account';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { CommonModule } from '@angular/common';
import { SharedSxmUiUiCreditCardFormFieldsModule } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';

export interface ReviewQuoteAndApproveFormComponentApi {
    setProcessingCompleted(): void;
}

export interface ReviewQuoteAndApproveLegacyQuotesExtraData {
    isBothRadios?: boolean;
    isPlatinumVIP?: boolean;
    showTotalAsPaid?: boolean;
    isUpgradePkg?: boolean;
    isAnnual?: boolean;
    isAcsc?: boolean;
    isFlepz?: boolean;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-review-quote-and-approve-form',
    templateUrl: './review-quote-and-approve-form.component.html',
    styleUrls: ['./review-quote-and-approve-form.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        SharedSxmUiUiCreditCardFormFieldsModule,
        // TODO: need to look in to updating this module so it doesn't depend on the old SxmUi module
        DomainsQuotesUiOrderSummaryModule,
        SharedSxmUiUiNucaptchaModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiDataClickTrackModule,
    ],
})
export class ReviewQuoteAndApproveFormComponent implements ReviewQuoteAndApproveFormComponentApi, ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    @Input() quoteViewModel;
    @Input() shouldIncludeNuCaptcha = false;
    @Input() showUnusedCreditLine = false;
    @Input() continueButtonTextOverride: string;
    @Input() useQuotesAlternateHeader = false;
    // TODO: refactor this to be more specific at the quote-summary component level as to what it is doing
    @Input() legacySettings: { isStreamingFlow: boolean; isNewAccount: boolean } = { isStreamingFlow: false, isNewAccount: false };
    @Input() extraData: ReviewQuoteAndApproveLegacyQuotesExtraData;
    @Output() formCompleted = new EventEmitter();
    transactionForm: FormGroup;
    captchaAnswerWrong$ = new BehaviorSubject(false);
    transactionFormProcessing$ = new BehaviorSubject(false);
    @ViewChild('nuCaptchaComponent') private readonly _nuCaptchaComponent: SxmUiNucaptchaComponent;
    @Input() isQuebecProvince;
    @Input() useRateVersionOfTextCopy;
    hasCaptcha = false;

    isClosedRadio$ = this._store.select(getIsClosedRadio);
    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _validateNuCaptchaWorkflowService: ValidateNucaptchaWorkflowService
    ) {
        translationsForComponentService.init(this);
        this.transactionForm = this._formBuilder.group({
            chargeAgreementAccepted: [false, { validators: [Validators.requiredTrue] }],
            nuCaptchaAnswer: this._formBuilder.control(''),
        });
    }

    setProcessingCompleted(): void {
        this.transactionFormProcessing$.next(false);
    }

    gotCaptcha(val): void {
        this.hasCaptcha = val;
        this.hasCaptcha
            ? this.transactionForm.controls?.nuCaptchaAnswer?.setValidators(Validators.required)
            : this.transactionForm.controls?.nuCaptchaAnswer?.setValidators(null);
        this.transactionForm.controls?.nuCaptchaAnswer?.reset();
    }

    submitTransaction() {
        this.transactionForm.markAllAsTouched();
        this.transactionFormProcessing$.next(true);
        if (this.transactionForm.valid) {
            if (this.shouldIncludeNuCaptcha && this._nuCaptchaComponent) {
                this._validateNuCaptchaWorkflowService
                    .build({ answer: this.transactionForm.value?.nuCaptchaAnswer?.answer, token: this._nuCaptchaComponent?.getCaptchaToken() })
                    .subscribe({
                        next: (valid) => {
                            if (valid) {
                                this.formCompleted.next();
                            } else {
                                this.captchaAnswerWrong$.next(true);
                            }
                        },
                        error: () => {
                            // TODO: display system error
                            this.transactionFormProcessing$.next(false);
                        },
                    });
            } else {
                this.formCompleted.next();
            }
        } else {
            const errors = [];
            // TODO: add client side validation errors here
            if (errors.length > 0) {
                this._store.dispatch(behaviorEventErrorsFromUserInteraction({ errors }));
            }
            this.transactionFormProcessing$.next(false);
        }
    }
}
