import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import {
    getQuoteViewModel,
    getSelectedOfferEtf,
    getSelectedPlanDealType,
    getSelectedPlanDealViewModelForAmazon,
    SubmitAccountRegistrationWorkflowService,
    getConfirmationDataForOrganic,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import { RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import { AMAZON_CLIENT_ID } from '@de-care/shared/configuration-tokens-amazon';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { ScrollService } from '@de-care/shared/browser-common/window-scroll';
import { CurrencyPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'confirmation-page',
    templateUrl: './organic-confirmation-page.component.html',
    styleUrls: ['./organic-confirmation-page.component.scss'],
})
export class OrganicConfirmationPageComponent implements AfterViewInit, OnDestroy {
    translateKeyPrefix = 'DeCareUseCasesCheckoutFeatureStreamingModule.ConfirmationPageComponent.';
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    confirmationDataForOrganic$ = this._store.select(getConfirmationDataForOrganic);
    selectedPlanDealViewModelForAmazon$ = this._store.select(getSelectedPlanDealViewModelForAmazon).pipe(
        map((data) => ({
            ...data,
            clientId: this.amazonClientId,
        }))
    );
    quoteViewModel$ = combineLatest([
        this._store.select(getQuoteViewModel),
        this._store.select(getSelectedOfferEtf),
        this._translateService.onLangChange.pipe(startWith({ lang: this._translateService.currentLang })),
    ]).pipe(
        filter(([quotes]) => !!quotes),
        map(([quotes, etfData]) => {
            if (etfData && quotes.currentQuote) {
                const details = quotes.currentQuote.details.map((detail) => {
                    if (detail.packageName !== 'AMZ_DOT') {
                        return {
                            ...detail,
                            priceAndTermSubText: this.getEtfPriceAndTermSubtext(etfData),
                        };
                    }
                    return detail;
                });
                return {
                    ...quotes,
                    currentQuote: {
                        ...quotes.currentQuote,
                        details: details,
                    },
                };
            }
            return quotes;
        })
    );
    registerCredentialsState = RegisterCredentialsState.None;
    registrationCompleted$ = new BehaviorSubject(false);
    dealRedemptionInstructions$ = combineLatest([
        this._store.select(getSelectedPlanDealType),
        this._translateService.stream(this.translateKeyPrefix + 'DEAL_REDEMPTION_INSTRUCTIONS'),
    ]).pipe(
        map(([dealType, dealRedemptionInstructions]) => {
            const instructions = dealRedemptionInstructions?.[dealType];
            return instructions
                ? {
                      title: instructions?.['TITLE'],
                      productImage: instructions?.['image']?.['src'],
                      descriptions: instructions?.['DESCRIPTION'],
                  }
                : null;
        })
    );
    constructor(
        private readonly _store: Store,
        private _translateService: TranslateService,
        private readonly _submitAccountRegistrationWorkflowService: SubmitAccountRegistrationWorkflowService,
        @Inject(AMAZON_CLIENT_ID) private readonly amazonClientId: string,
        private readonly _currencyPipe: CurrencyPipe,
        private readonly _scrollService: ScrollService
    ) {}

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'confirmation' }));
        this._scrollService.scrollToElementBySelector('listen-now-with-icon');
    }

    onRegisterAccount(registerData) {
        this._submitAccountRegistrationWorkflowService.build(registerData).subscribe({
            next: () => {
                this.registrationCompleted$.next(true);
            },
            error: () => {
                // TODO: show system error
            },
        });
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.unsubscribe();
    }

    private getEtfPriceAndTermSubtext(etfData: { etfAmount: string; etfTerm: string }) {
        return this._translateService.instant(`${this.translateKeyPrefix}PRICE_AND_TERM_SUBTEXT`, {
            etfAmount: this._currencyPipe.transform(etfData.etfAmount, 'USD', 'symbol-narrow', '1.0-0', this._translateService.currentLang),
            etfTerm: etfData.etfTerm,
        });
    }
}
