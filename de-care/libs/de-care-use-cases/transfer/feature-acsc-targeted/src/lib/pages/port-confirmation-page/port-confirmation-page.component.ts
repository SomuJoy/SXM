import { Component, OnInit, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import {
    getConfirmationData,
    getIsLoggedIn,
    getCarDetailsPortDataAsArray,
    getSubscriptionDetailsPortDataAsArray,
    getPaymentType,
    getOACLoginRedirectUrl,
    getQuoteDataForSP,
    getHideSPQuoteInitially,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { PrintService } from '@de-care/shared/browser-common/window-print';
import { tap, takeUntil, catchError, map } from 'rxjs/operators';
import { PasswordError, RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import { RegisterWorkflowService } from '@de-care/domains/account/state-account';
import { Subject, of, combineLatest } from 'rxjs';
import { scrollToTop } from '@de-care/browser-common';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { CurrencyPipe, DOCUMENT, I18nPluralPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { mapQuoteDataForSP } from '../../helpers';

@Component({
    selector: 'de-care-port-confirmation-page',
    templateUrl: './port-confirmation-page.component.html',
    styleUrls: ['./port-confirmation-page.component.scss'],
})
export class PortConfirmationPageComponent implements OnInit, AfterViewInit, OnDestroy {
    translateKeyPrefix = 'DeCareUseCasesTransferFeatureACSCTargetedModule.PortConfirmationPageComponent.';
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
    confirmationData$ = this._store.pipe(
        select(getConfirmationData),
        tap((data) => {
            this.setupRegisterCredentialsState(data.registerData.account);
        })
    );
    getIsLoggedIn$ = this._store.pipe(select(getIsLoggedIn));
    registerCredentialState: RegisterCredentialsState = RegisterCredentialsState.All;
    registrationCompleted: boolean;
    passwordError: PasswordError = null;
    private unsubscribe$: Subject<void> = new Subject();
    private readonly _window: Window;

    constructor(
        private readonly _printService: PrintService,
        private readonly _store: Store,
        private readonly _registerWorkFlowService: RegisterWorkflowService,
        private readonly _currencyPipe: CurrencyPipe,
        private readonly _translateService: TranslateService,
        private readonly _i18nPluralPipe: I18nPluralPipe,
        @Inject(DOCUMENT) document
    ) {
        this._window = document && document.defaultView;
    }

    ngOnInit() {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'confirmation' }));
    }
    ngAfterViewInit() {
        scrollToTop();
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onPrintClick(): void {
        this._printService.print();
    }

    onRegisterAccount($event) {
        const registrationData = $event.userName ? $event : { ...$event };
        this._registerWorkFlowService
            .build({ registrationData })
            .pipe(
                takeUntil(this.unsubscribe$),
                catchError((err) => {
                    // TODO: event tracking
                    return of(err);
                })
            )
            .subscribe((resp) => {
                this.registrationCompleted = resp.status === 'SUCCESS';
            });
    }

    onGoToMyAccount(): void {
        this._store.pipe(select(getOACLoginRedirectUrl)).subscribe((url) => {
            this._window.location.href = url;
        });
    }

    private setupRegisterCredentialsState(data): void {
        const useEmailAsUserName = data.useEmailAsUserName;
        this.registerCredentialState = useEmailAsUserName ? RegisterCredentialsState.PasswordOnly : RegisterCredentialsState.All;
    }
}
