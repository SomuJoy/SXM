import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
    getPaymentType,
    getSubmitTransactionAsProcessing,
    getCarDetailsPortDataAsArray,
    getSubscriptionDetailsPortDataAsArray,
    getPaymentTypeFromAccount,
    setPaymentTypeAsInvoice,
    setPaymentTypeAsCreditCard,
    getQuoteDataForSP,
    getHideSPQuoteInitially,
    getShowGST,
    getShowQST,
    SubmitTransactionWorkflowService,
    getShowRateVersionOfChargeAgreement,
    getShowPlatformChangeForSP,
    getPlatformChangeDataForSP,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { map, withLatestFrom, take } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CurrencyPipe, I18nPluralPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { mapQuoteDataForSP } from '../../helpers';

@Component({
    selector: 'de-care-port-review',
    templateUrl: './port-review.component.html',
    styleUrls: ['./port-review.component.scss'],
})
export class PortReviewComponent implements OnInit {
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.PortReviewComponent.';
    getSubmitTransactionAsProcessing$ = this._store.pipe(select(getSubmitTransactionAsProcessing));
    carDetailsPortData$ = this._store.pipe(select(getCarDetailsPortDataAsArray));
    subscriptionDetailsPortData$ = this._store.pipe(select(getSubscriptionDetailsPortDataAsArray));
    paymentType$ = this._store.pipe(select(getPaymentType));
    _quoteSummaryData$ = this._store.pipe(select(getQuoteDataForSP));
    quoteSummaryData$ = combineLatest([this._quoteSummaryData$, this._translateService.stream(`${this.translateKeyPrefix}QUOTE_SUMMARY`)]).pipe(
        map(([quoteData, translateText]) =>
            mapQuoteDataForSP(quoteData, translateText, this._currencyPipe, this._translateService, this._i18nPluralPipe, this.translateKeyPrefix)
        )
    );
    hideSPQuoteInitially$ = this._store.pipe(select(getHideSPQuoteInitially));
    showGST$ = this._store.pipe(select(getShowGST));
    showQST$ = this._store.pipe(select(getShowQST));
    showRateVersionOfChargeAgreement$ = this._store.pipe(select(getShowRateVersionOfChargeAgreement));
    showPlatformChange$ = this._store.pipe(select(getShowPlatformChangeForSP));
    platformChangeData$ = this._store.pipe(select(getPlatformChangeDataForSP));

    transactionForm: FormGroup;
    @Input() priceChangeMessagingTypeFeatureFlag: boolean;
    @Input() priceChangeMessagingType: string;
    @Output() submitTransactionComplete = new EventEmitter();

    constructor(
        private readonly _store: Store,
        private readonly _formBuilder: FormBuilder,
        private readonly _currencyPipe: CurrencyPipe,
        private readonly _translateService: TranslateService,
        private readonly _i18nPluralPipe: I18nPluralPipe,
        private readonly _submitTransactionWorkflowService: SubmitTransactionWorkflowService
    ) {
        this.transactionForm = this._formBuilder.group({
            chargeAgreementAccepted: [false, { validators: [Validators.requiredTrue] }],
        });
    }

    ngOnInit() {
        // Checking if the paymentType is set, if not, then setting it based on the account
        this._store
            .pipe(
                select(getPaymentType),
                take(1),
                withLatestFrom(this._store.pipe(select(getPaymentTypeFromAccount))),
                map(([paymentTypeFromState, paymentTypeFromAccount]) => {
                    if (!paymentTypeFromState) {
                        if (paymentTypeFromAccount === 'invoice') {
                            this._store.dispatch(setPaymentTypeAsInvoice());
                        } else if (paymentTypeFromAccount === 'creditCard') {
                            this._store.dispatch(setPaymentTypeAsCreditCard());
                            //TODO: maybe want to set paymentInfo here?
                        }
                    }
                })
            )
            .subscribe();
    }

    onConfirmReviewAndSubmit() {
        this.transactionForm.markAllAsTouched();
        if (this.transactionForm.get('chargeAgreementAccepted').value) {
            this._submitTransactionWorkflowService.build().subscribe((_) => {
                this.submitTransactionComplete.emit();
            });
        }
    }
}
