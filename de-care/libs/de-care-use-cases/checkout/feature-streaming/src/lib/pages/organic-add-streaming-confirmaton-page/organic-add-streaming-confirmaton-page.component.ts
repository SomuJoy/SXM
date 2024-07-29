import { CommonModule, CurrencyPipe, DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { clearUserEnteredUsername, getSelectedPlanDealType } from '@de-care/de-care-use-cases/checkout/state-common';
import {
    getConfirmationDataForOrganic,
    getQuoteViewModel,
    getSelectedOfferEtf,
    getSelectedPlanDealViewModelForAmazon,
    SubmitAccountRegistrationWorkflowService,
} from '@de-care/de-care-use-cases/checkout/state-streaming';
import { DomainsAccountUiRegisterModule, RegisterCredentialsState } from '@de-care/domains/account/ui-register';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { DomainsSubscriptionsUiRedeemAndLinkWithAmazonModule } from '@de-care/domains/subscriptions/ui-redeem-and-link-with-amazon';
import { AMAZON_CLIENT_ID } from '@de-care/shared/configuration-tokens-amazon';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { SxmUiButtonCtaComponentModule } from '@de-care/shared/sxm-ui/ui-button-cta';
import { SharedSxmUiUiDealAddonCardModule } from '@de-care/shared/sxm-ui/ui-deal-addon-card';
import { SharedSxmUiUiListenOnDevicesModule } from '@de-care/shared/sxm-ui/ui-listen-on-devices';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'organic-add-streaming-confirmaton-page',
    templateUrl: './organic-add-streaming-confirmaton-page.component.html',
    styleUrls: ['./organic-add-streaming-confirmaton-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        SharedSxmUiUiDealAddonCardModule,
        SharedSxmUiUiListenOnDevicesModule,
        DomainsAccountUiRegisterModule,
        DomainsQuotesUiOrderSummaryModule,
        TranslateModule,
        ReactiveComponentModule,
        SxmUiButtonCtaComponentModule,
        DomainsSubscriptionsUiRedeemAndLinkWithAmazonModule,
        RouterModule,
    ],
    standalone: true,
})
export class OrganicAddStreamingConfirmatonPageComponent implements ComponentWithLocale, AfterViewInit, OnDestroy, OnInit {
    translateKeyPrefix: string;
    languageResources: LanguageResources;
    private _destroy$: Subject<boolean> = new Subject<boolean>();
    confirmationDataForOrganic$ = this._store.select(getConfirmationDataForOrganic);
    constructor(
        readonly translationsForComponentService: TranslationsForComponentService,
        private readonly _store: Store,
        private _translateService: TranslateService,
        private readonly _submitAccountRegistrationWorkflowService: SubmitAccountRegistrationWorkflowService,
        @Inject(DOCUMENT) document: Document,
        @Inject(AMAZON_CLIENT_ID) private readonly amazonClientId: string,
        private readonly _currencyPipe: CurrencyPipe
    ) {
        document.body.scrollTop = 0;
        translationsForComponentService.init(this);
    }
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
    dealRedemptionInstructions$ = combineLatest([this._store.select(getSelectedPlanDealType), this.getDealRedemptionInstant()]).pipe(
        map(([dealType, dealRedemptionInstructions]) => {
            console.log(dealRedemptionInstructions, 'deal redemption instruction');
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

    ngOnInit() {
        this._store.dispatch(clearUserEnteredUsername());
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'confirmation' }));
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

    private getDealRedemptionInstant() {
        return this._translateService.stream(this.translateKeyPrefix + 'DEAL_REDEMPTION_INSTRUCTIONS');
    }
    private getEtfPriceAndTermSubtext(etfData: { etfAmount: string; etfTerm: string }) {
        return this._translateService.instant(`${this.translateKeyPrefix}PRICE_AND_TERM_SUBTEXT`, {
            etfAmount: this._currencyPipe.transform(etfData.etfAmount, 'USD', 'symbol-narrow', '1.0-0', this._translateService.currentLang),
            etfTerm: etfData.etfTerm,
        });
    }
}
