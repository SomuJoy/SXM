import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
    getTransferFromInfoForSwap,
    getNewRadioInfoForSwap,
    selectAccountData,
    setPaymentInfo,
    setPaymentTypeAsCreditCard,
    clearPaymentInfo,
    setPaymentMethodAsCardOnFile,
    setPaymentMethodAsNotCardOnFile,
    getSubmitTransactionAsProcessing,
    getShowQuoteAndPayment,
    getShowPlatformChangeForSwap,
    getPlatformChangeDataForSwap,
    getSwapQuoteSummaryData,
    SubmitSwapTransactionWorkflowService,
    getShowGST,
    getShowQST,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { combineLatest } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map } from 'rxjs/operators';
import { CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { mapQuoteData } from '../../helpers';

@Component({
    selector: 'de-care-swap-radio-page',
    templateUrl: './swap-radio-page.component.html',
    styleUrls: ['./swap-radio-page.component.scss'],
})
export class SwapRadioPageComponent implements OnInit {
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.SwapRadioPageComponent.';
    serviceError = false;
    locale: string;

    transferFromData$ = this._store.pipe(select(getTransferFromInfoForSwap));
    newRadioInfo$ = this._store.pipe(select(getNewRadioInfoForSwap));
    selectAccount$ = this._store.pipe(select(selectAccountData));
    submitTransactionAsProcessing$ = this._store.pipe(select(getSubmitTransactionAsProcessing));
    showQuoteAndPayment$ = this._store.pipe(select(getShowQuoteAndPayment));
    showPlatformChange$ = this._store.pipe(select(getShowPlatformChangeForSwap));
    platformChangeData$ = this._store.pipe(select(getPlatformChangeDataForSwap));
    _quoteSummaryData$ = this._store.pipe(select(getSwapQuoteSummaryData));
    showGST$ = this._store.pipe(select(getShowGST));
    showQST$ = this._store.pipe(select(getShowQST));

    quoteData$ = combineLatest([this._quoteSummaryData$, this._translateService.stream(`${this.translateKeyPrefix}QUOTE_SUMMARY`)]).pipe(
        map(([{ currentCharges }, quoteText]) => mapQuoteData(currentCharges, quoteText, this._currencyPipe, this._translateService.currentLang))
    );

    constructor(
        private readonly _store: Store,
        private readonly _translateService: TranslateService,
        private readonly _currencyPipe: CurrencyPipe,
        private readonly _submitSwapTransactionWorkflowService: SubmitSwapTransactionWorkflowService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'radiofound' }));
    }

    onPaymentFormComplete(evt) {
        if (evt.paymentForm?.ccNum) {
            this._store.dispatch(setPaymentInfo({ paymentInfo: evt.paymentForm }));
            this._store.dispatch(setPaymentTypeAsCreditCard());
        } else {
            this._store.dispatch(clearPaymentInfo());
        }

        if (evt.useCardOnFile) {
            this._store.dispatch(setPaymentMethodAsCardOnFile());
            this._store.dispatch(setPaymentTypeAsCreditCard());
        } else {
            this._store.dispatch(setPaymentMethodAsNotCardOnFile());
        }

        this.onSubmitTransaction();
    }

    onSubmitTransaction() {
        this.serviceError = false;
        this._submitSwapTransactionWorkflowService
            .build()
            .pipe(
                catchError(() => {
                    this.serviceError = true;
                    return null;
                })
            )
            .subscribe(() => {
                this._router.navigate(['../thanks'], { relativeTo: this._activatedRoute });
            });
    }
}
