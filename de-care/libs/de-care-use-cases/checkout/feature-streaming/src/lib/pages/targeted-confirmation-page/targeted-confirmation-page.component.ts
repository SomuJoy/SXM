import { AfterViewInit, Component, Inject } from '@angular/core';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import {
    getCurrentUserViewModel,
    getIsRtpOrStepUpPlan,
    getListenNowTokenViewModel,
    getQuebecProvince,
    getQuoteViewModelForTargeted,
    getSelectedOfferEtf,
    getSelectedPlanDealType,
    getSelectedPlanDealViewModelForAmazon,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import { CurrencyPipe } from '@angular/common';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { combineLatest } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { map, startWith, filter } from 'rxjs/operators';
import { AMAZON_CLIENT_ID } from '@de-care/shared/configuration-tokens-amazon';
import { ScrollService } from '@de-care/shared/browser-common/window-scroll';

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'targeted-confirmation-page',
    templateUrl: './targeted-confirmation-page.component.html',
    styleUrls: ['./targeted-confirmation-page.component.scss'],
})
export class TargetedConfirmationPageComponent implements ComponentWithLocale, AfterViewInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    listenNowTokenViewModel$ = this._store.select(getListenNowTokenViewModel);
    getSelectedPlanDealType$ = this._store.select(getSelectedPlanDealType);
    selectedPlanDealViewModelForAmazon$ = this._store.select(getSelectedPlanDealViewModelForAmazon).pipe(
        map((data) => ({
            ...data,
            clientId: this.amazonClientId,
        }))
    );
    isQuebecProvince$ = this._store.select(getQuebecProvince);
    isRtpOrStepUpPlan$ = this._store.select(getIsRtpOrStepUpPlan);
    quoteViewModel$ = combineLatest([
        this._store.select(getQuoteViewModelForTargeted),
        this._store.select(getSelectedOfferEtf),
        this.translateService.onLangChange.pipe(startWith({ lang: this.translateService.currentLang })),
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
    getCurrentUserViewModel$ = this._store.select(getCurrentUserViewModel);

    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private readonly translateService: TranslateService,
        private readonly currencyPipe: CurrencyPipe,
        @Inject(AMAZON_CLIENT_ID) private readonly amazonClientId: string,
        private readonly _scrollService: ScrollService
    ) {
        translationsForComponentService.init(this);
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'confirmation' }));
        this._scrollService.scrollToElementBySelector('listen-now-with-icon');
    }

    private getEtfPriceAndTermSubtext(etfData: { etfAmount: string; etfTerm: string }) {
        return this.translateService.instant(`${this.translateKeyPrefix}.PRICE_AND_TERM_SUBTEXT`, {
            etfAmount: this.currencyPipe.transform(etfData.etfAmount, 'USD', 'symbol-narrow', '1.0-0', this.translateService.currentLang),
            etfTerm: etfData.etfTerm,
        });
    }
}
