import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
    getInfoToMakePaymentViewModel,
    ProcessPaymentWorkflowService,
    getOptionsSelectorsToDisplay,
    collectPaymentInformation,
} from '@de-care/de-care-use-cases/account/state-payment';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { BalanceAndPaymentInfoFormComponent, BalanceAndPaymentInfoFormComponentApi } from '@de-care/de-care-use-cases/account/ui-common';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { DOCUMENT } from '@angular/common';

export type PaymentFrequency = 'recurring' | 'oneTime';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-submit-payment-page',
    templateUrl: './submit-payment-page.component.html',
    styleUrls: ['./submit-payment-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitPaymentPageComponent implements ComponentWithLocale, OnInit, AfterViewInit, OnDestroy {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    infoToMakePaymentViewModel$ = this._store.select(getInfoToMakePaymentViewModel);
    paymentForm: FormGroup;
    paymentFormSubmitted: false;
    recurring: PaymentFrequency = 'recurring';
    oneTime: PaymentFrequency = 'oneTime';

    private _unsubscribe$ = new Subject<boolean>();

    creditCardSubmissionError$ = new BehaviorSubject(false);
    unexpectedSubmissionError$ = new BehaviorSubject(false);
    paymentFormProcessing$ = new BehaviorSubject(false);
    verifyAddressesDataViewModel$: any;
    currentLang$;
    paymentAmountFormStatus$;

    @ViewChild(BalanceAndPaymentInfoFormComponent) private readonly _balanceAndPaymentInfoFormComponent: BalanceAndPaymentInfoFormComponentApi;

    get amountOptionIsInvalid(): boolean {
        const amountForm = this.paymentForm?.get('paymentAmountOption');
        return amountForm?.touched && amountForm?.invalid;
    }

    get frequencyOptionIsInvalid(): boolean {
        const frequencyForm = this.paymentForm.get('paymentFrequencyOption');
        return frequencyForm?.touched && frequencyForm?.invalid;
    }

    private readonly _addressSuggestionsViewModel$ = new BehaviorSubject<{ correctedAddresses: any[]; addressCorrectionAction: any }>({
        correctedAddresses: [],
        addressCorrectionAction: null,
    });

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly _rotuer: Router,
        private readonly _processPaymentWorkflowService: ProcessPaymentWorkflowService,
        private readonly _formBuilder: FormBuilder,
        @Inject(COUNTRY_SETTINGS) public readonly countrySettings: CountrySettingsToken,
        @Inject(DOCUMENT) private readonly _document: Document
    ) {
        translationsForComponentService.init(this);
        this.currentLang$ = translationsForComponentService.currentLang$;
        this.paymentForm = this._formBuilder.group({
            serviceAddress: null,
            creditCardInfo: new FormGroup({}),
            chargeAgreementAccepted: new FormControl(false, Validators.required),
            paymentAmountOption: new FormControl(''),
            paymentFrequencyOption: new FormControl(''),
        });

        this.verifyAddressesDataViewModel$ = combineLatest([
            this._addressSuggestionsViewModel$,
            this.translationsForComponentService.stream(`${this.translateKeyPrefix}.CONFIRM_YOUR_ADDRESS`),
        ]).pipe(
            map(([viewModel, headingText]) => ({
                ...viewModel,
                headingText,
                currentAddress: { ...this.paymentForm.controls.serviceAddress.value },
            }))
        );
    }

    ngOnInit(): void {
        this._store
            .select(getOptionsSelectorsToDisplay)
            .pipe(take(1))
            .subscribe((options) => {
                options.optionsAmountToPay && this.paymentForm.get('paymentAmountOption').setValidators(Validators.required);
                options.optionsPaymentFrequency && this.paymentForm.get('paymentFrequencyOption').setValidators(Validators.required);
            });

        this.paymentAmountFormStatus$ = this.paymentForm.get('paymentAmountOption').statusChanges;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'paymentinfo' }));
    }

    ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

    processPaymentForm(formData) {
        this._balanceAndPaymentInfoFormComponent.clearCreditCardSubmissionError();
        this._balanceAndPaymentInfoFormComponent.clearUnexpectedSubmissionError();
        this._store.dispatch(collectPaymentInformation({ paymentInformation: formData.paymentInfo }));
        this._processPaymentWorkflowService
            .build()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe({
                next: (resp) => {
                    this._rotuer.navigate(['account', 'pay', 'make-payment', 'thankyou']);
                    return resp && this._balanceAndPaymentInfoFormComponent.setProcessingCompleted();
                },
                error: (error) => {
                    if (error === 'CREDIT_CARD_FAILURE') {
                        this._balanceAndPaymentInfoFormComponent.showCreditCardSubmissionError();
                    } else {
                        this._balanceAndPaymentInfoFormComponent.showUnexpectedSubmissionError();
                    }
                    this._balanceAndPaymentInfoFormComponent.setProcessingCompleted();
                },
            });
    }

    backToMyAccount() {
        this._document.defaultView.history.back();
    }
}
