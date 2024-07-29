import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import {
    getTransferFromInfoForSwap,
    getNewRadioInfoForSwap,
    getShowPlatformChangeForSwap,
    getPlatformChangeDataForSwap,
    getSwapQuoteSummaryData,
    getOACLoginRedirectUrl,
    getSwapConfirmationData,
    getCanSwapConfirmationShowStreaming,
    getShowQuoteAndPayment,
    getShowGST,
    getShowQST,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { combineLatest } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyPipe, DOCUMENT } from '@angular/common';
import { map } from 'rxjs/operators';
import { PrintService } from '@de-care/shared/browser-common/window-print';
import { mapQuoteData } from '../../helpers';
import { scrollToTop } from '@de-care/browser-common';

@Component({
    selector: 'de-care-swap-confirmation-page',
    templateUrl: './swap-confirmation-page.component.html',
    styleUrls: ['./swap-confirmation-page.component.scss'],
})
export class SwapConfirmationPageComponent implements OnInit, AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.SwapConfirmationPageComponent.';
    private readonly _window: Window;

    confirmationData$ = this._store.pipe(select(getSwapConfirmationData));
    transferFromData$ = this._store.pipe(select(getTransferFromInfoForSwap));
    newRadioInfo$ = this._store.pipe(select(getNewRadioInfoForSwap));
    showPlatformChange$ = this._store.pipe(select(getShowPlatformChangeForSwap));
    platformChangeData$ = this._store.pipe(select(getPlatformChangeDataForSwap));
    canSwapConfirmationShowStreaming$ = this._store.pipe(select(getCanSwapConfirmationShowStreaming));
    showQuoteAndPayment$ = this._store.pipe(select(getShowQuoteAndPayment));
    showGST$ = this._store.pipe(select(getShowGST));
    showQST$ = this._store.pipe(select(getShowQST));

    _quoteSummaryData$ = this._store.pipe(select(getSwapQuoteSummaryData));

    quoteData$ = combineLatest([this._quoteSummaryData$, this._translateService.stream(`${this.translateKeyPrefix}QUOTE_SUMMARY`)]).pipe(
        map(([{ currentCharges }, quoteText]) => mapQuoteData(currentCharges, quoteText, this._currencyPipe, this._translateService.currentLang))
    );

    constructor(
        private readonly _store: Store,
        private readonly _translateService: TranslateService,
        private readonly _currencyPipe: CurrencyPipe,
        private readonly _printService: PrintService,
        @Inject(DOCUMENT) document
    ) {
        this._window = document && document.defaultView;
    }

    ngOnInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'swapconfirmation' }));
    }

    ngAfterViewInit() {
        scrollToTop();
    }

    onPrintClick(): void {
        this._printService.print();
    }

    onGoToMyAccount(): void {
        this._store.pipe(select(getOACLoginRedirectUrl)).subscribe((url) => {
            this._window.location.href = url;
        });
    }
}
