import { DOCUMENT, CurrencyPipe, CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { getQuebecProvince, getSelectedPlanDealType } from '@de-care/de-care-use-cases/checkout/state-common';
import {
    getListenNowTokenViewModel,
    getSelectedPlanDealViewModelForAmazon,
    getIsRtpOrStepUpPlan,
    getQuoteViewModelForTargeted,
    getSelectedOfferEtf,
    getCurrentUserViewModel,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { DomainsSubscriptionsUiRedeemAndLinkWithAmazonModule } from '@de-care/domains/subscriptions/ui-redeem-and-link-with-amazon';
import { AMAZON_CLIENT_ID } from '@de-care/shared/configuration-tokens-amazon';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SxmUiButtonCtaComponentModule } from '@de-care/shared/sxm-ui/ui-button-cta';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { map, startWith, filter } from 'rxjs/operators';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'tageted-add-streaming-confirmation-page',
    templateUrl: './tageted-add-streaming-confirmation-page.component.html',
    styleUrls: ['./tageted-add-streaming-confirmation-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,

    imports: [
        CommonModule,
        DomainsQuotesUiOrderSummaryModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        TranslateModule,
        ReactiveComponentModule,
        DomainsSubscriptionsUiRedeemAndLinkWithAmazonModule,
        SxmUiButtonCtaComponentModule,
        RouterModule,
    ],
    standalone: true,
})
export class TagetedAddStreamingConfirmationPageComponent implements ComponentWithLocale {
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
        @Inject(DOCUMENT) document: Document,
        private readonly translateService: TranslateService,
        private readonly currencyPipe: CurrencyPipe,
        @Inject(AMAZON_CLIENT_ID) private readonly amazonClientId: string
    ) {
        translationsForComponentService.init(this);
        document.body.scrollTop = 0;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'confirmation' }));
    }

    private getEtfPriceAndTermSubtext(etfData: { etfAmount: string; etfTerm: string }) {
        return this.translateService.instant(`${this.translateKeyPrefix}.PRICE_AND_TERM_SUBTEXT`, {
            etfAmount: this.currencyPipe.transform(etfData.etfAmount, 'USD', 'symbol-narrow', '1.0-0', this.translateService.currentLang),
            etfTerm: etfData.etfTerm,
        });
    }
}
