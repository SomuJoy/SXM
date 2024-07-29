import { Inject, Injectable } from '@angular/core';
import { getAllOffersAsArray, Offer } from '@de-care/domains/offers/state-offers';
import { setRecapDescriptionForOffers } from '@de-care/domains/offers/state-offers-info';
import { TranslationSettingsToken, TRANSLATION_SETTINGS, CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { formatCurrency, I18nPluralPipe, NgLocaleLocalization } from '@angular/common';
import { behaviorEventErrorFromAppCode } from '@de-care/shared/state-behavior-events';

interface WorkflowRequest {
    province: string | undefined;
}

@Injectable({ providedIn: 'root' })
export class AugmentOfferInfoWithRecapDescriptionWorkflow implements DataWorkflow<WorkflowRequest, boolean> {
    translateKeyPrefix = 'DomainsOffersStateOffersWithCmsModule.RECAP_DESCRIPTION';

    constructor(
        private readonly _store: Store,
        @Inject(TRANSLATION_SETTINGS) private readonly _translationSettings: TranslationSettingsToken,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken,
        private readonly _translateService: TranslateService
    ) {}

    build({ province }: WorkflowRequest): Observable<boolean> {
        return this._store.select(getAllOffersAsArray).pipe(
            take(1),
            tap((offers) => {
                // build recapDescription based on offers data and province for each this._translationSettings.languagesSupported
                const offersInfo: { locale: string; planCode: string; recapDescription: string; recapLongDescription?: string }[] =
                    this._translationSettings.languagesSupported.reduce((set, locale) => {
                        return [
                            ...set,
                            ...offers.map((offer) => ({
                                locale,
                                planCode: offer.planCode,
                                recapDescription: this._createRecapDescription(locale, province, offer),
                                recapLongDescription: this._createRecapDescription(locale, province, offer, true),
                            })),
                        ];
                    }, []);
                // then dispatch augment action
                this._store.dispatch(setRecapDescriptionForOffers({ offersInfo }));
            }),
            map(() => true)
        );
    }

    private _createRecapDescription(locale: string, province: string, offer: Offer, longDescription?: boolean): string {
        const pluralPipe = new I18nPluralPipe(new NgLocaleLocalization(locale));
        const moduleTranslations = this._translateService.store.translations[locale]['DomainsOffersStateOffersWithCmsModule'];
        if (!moduleTranslations) {
            this._store.dispatch(
                behaviorEventErrorFromAppCode({
                    error: `Translations for DomainsOffersStateOffersWithCmsModule not found...was the [DomainsOffersStateOffersWithCmsModule] properly imported for the feature?`,
                })
            );
        }
        const translations = this._translateService.store.translations[locale]['DomainsOffersStateOffersWithCmsModule']['RECAP_DESCRIPTION'];
        const isQuebec = !!(province?.toLowerCase() === 'qc');
        const mrdEligible = !!offer?.mrdEligible;
        let includeFeeText;
        if (offer?.price === 0 && offer?.retailPrice === 0) {
            includeFeeText = false;
        } else if (province?.length > 0 && province?.toLowerCase() !== 'qc' && offer?.retailPrice !== 0) {
            includeFeeText = true;
        } else {
            includeFeeText = false;
        }

        const termLength = offer?.termLength;
        const pricePerMonth = offer?.price;
        const followOnNotAllowed = [
            'Premier Streaming - Monthly|Promo - Premier Streaming - Bolt-on $7.99/mo for 1mo',
            'Essential Streaming - Monthly|Promo - Essential Streaming - Bolt-on $4.99/mo for 1mo',
        ].includes(offer.planCode);
        const forOneNotAllowed = [
            'Trial - Premier Streaming - 1mo - $1.00 - AMZ DOT - G4',
            'Trial - Premier Streaming - 3mo - $1.00 - AMZ DOT - G4',
            'Trial - Premier Streaming - 3mo - $5.00 - AMZ DOT - G4',
            'Trial - Premier Streaming - 1mo - $5.00 - AMZ DOT - G4',
        ].includes(offer.planCode);
        const retailPricePerMonth = offer?.price !== offer?.retailPrice ? offer?.retailPrice : null;
        const msrpPrice = offer?.msrpPrice;
        const dealType = offer?.deal?.type;
        const dealTypeMap = {
            AMZ_DOT: ' + Echo Dot',
        };
        const dealRecapCardSuffix = dealTypeMap[dealType] || null;
        let recapString;
        if (mrdEligible) {
            const pre = this._translateService.getParsedResult(translations, isQuebec ? 'MRD_DISCOUNT_PRICE_QUEBEC' : 'MRD_DISCOUNT_PRICE', {
                pricePerMonth: formatCurrency(pricePerMonth, locale, '$', 'USD', '1.0-2'),
            });

            const suffix = this._translateService.getParsedResult(translations, 'MRD_REGULAR_PRICE', {
                msrpPrice: formatCurrency(msrpPrice, locale, '$', 'USD', undefined),
            });

            recapString = `<p>${pre} <s>${suffix}</s></p>`;
        } else {
            const pluralMap = this._translateService.getParsedResult(translations, 'PLURAL_MAP')['MONTH'];
            const monthString = pluralPipe.transform(termLength, pluralMap);

            const preFixPara = this._translateService.getParsedResult(
                translations,
                (pricePerMonth === 0 ? 'TERM_AND_PRICE_FREE' : 'TERM_AND_PRICE') +
                    (offer.termLength === 1 && !forOneNotAllowed ? '_FOR_ONE' : '') +
                    (offer.type === 'PROMO_MCP' ? '_MCP' : ''),
                {
                    termLength,
                    monthString,
                    pricePerMonth: formatCurrency(pricePerMonth, locale, '$', 'USD', undefined),
                    dealRecapCardSuffix: dealRecapCardSuffix || '',
                }
            );
            const retailPriceSpanText =
                retailPricePerMonth && !followOnNotAllowed
                    ? this._translateService.getParsedResult(translations, isQuebec ? 'FOLLOW_ON_PRICE_QUEBEC' : 'FOLLOW_ON_PRICE', {
                          retailPricePerMonth: formatCurrency(retailPricePerMonth, locale, '$', 'USD', undefined),
                      })
                    : '';
            const retailPriceSpan = retailPriceSpanText ? `<span>${retailPriceSpanText}</span>` : '';
            const includeFeeSpanText = includeFeeText ? this._translateService.getParsedResult(translations, 'PLUS_FEE') : '';
            const includeFeeSpan = includeFeeSpanText ? `<span>${includeFeeSpanText}</span>` : '';
            let pricingExtraLine = '';
            if (longDescription) {
                const desc = this._translateService.getParsedResult(translations, 'FEES_AND_TAXES_APPLY');
                pricingExtraLine = '<span>' + desc + '</span>';
            }
            recapString = `<p>${preFixPara} ${retailPriceSpan} ${includeFeeSpan} ${pricingExtraLine}</p>`;
        }
        return recapString;
    }
}
