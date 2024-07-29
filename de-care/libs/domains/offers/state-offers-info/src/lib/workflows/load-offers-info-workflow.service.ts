import { Inject, Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DataOffersInfoService, PlanCodeInfo } from '../data-services/data-offers-info.service';
import { OfferInfoModel } from '../state/reducer';
import { setOfferInfoForOffers } from '../state/actions';
import { loadOffersInfo400Error } from '../state/public.actions';
import { ListeningOptionsMapperService } from '../listening-options-mapper.service';
import { TranslationSettingsToken, TRANSLATION_SETTINGS, COUNTRY_SETTINGS, CountrySettingsToken } from '@de-care/shared/configuration-tokens-locales';
import { normalizeLangToLocaleForServiceCall, normalizeLocaleToLanguageAndCountryOnly } from '@de-care/domains/offers/state-offers-info-common';

export interface WorkflowRequest {
    planCodes: PlanCodeInfo[];
    province?: string | undefined;
    radioId?: string | undefined;
    locales?: string[];
}

@Injectable({ providedIn: 'root' })
export class LoadOffersInfoWorkflowService implements DataWorkflow<WorkflowRequest, void> {
    constructor(
        private readonly dataOffersInfoService: DataOffersInfoService,
        @Inject(TRANSLATION_SETTINGS) private readonly _translationSettings: TranslationSettingsToken,
        private readonly _store: Store,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken,
        private readonly _listeningOptionsMapperService: ListeningOptionsMapperService
    ) {}

    build(request: WorkflowRequest): Observable<void> {
        // TODO: remove dependency on TranslationSettingsToken so the request model is the only spot where locales comes from
        const locales = request.locales || this._translationSettings.languagesSupported;
        return this.dataOffersInfoService
            .getOffersInfo({
                ...request,
                locales: locales.map((locale) => normalizeLangToLocaleForServiceCall(locale, this._countrySettings.countryCode, request?.province)),
            })
            .pipe(
                map((response) => {
                    const offersInfoArray: OfferInfoModel[] = [];
                    const locales = response.locales;
                    locales.forEach((localeItem) => {
                        localeItem.offerInfos.map((info) => {
                            const offerDescription = info.offerDescription || null;
                            const locale = normalizeLocaleToLanguageAndCountryOnly(localeItem.locale);
                            offersInfoArray.push(<OfferInfoModel>{
                                locale,
                                planCode: info.planCode,
                                salesHero: info.salesHero,
                                paymentInterstitialBullets: info.paymentInterstitialBullets,
                                offerDescription: offerDescription,
                                offerDetails: info.offerDetails,
                                deals: info.deals,
                                packageDescription: {
                                    packageName: offerDescription?.packageName,
                                    highlightsTitle: offerDescription?.highlightsTitle,
                                    highlightsText: offerDescription?.highlightsText,
                                    listeningOptions: offerDescription?.listeningOptions,
                                    longDescription: offerDescription?.longDescription,
                                    icons: this._listeningOptionsMapperService.mapListeningOptionsToTextCopy(offerDescription?.listeningOptions, locale),
                                    footer: offerDescription?.footer,
                                    packageFeatures: offerDescription?.packageFeatures,
                                    packageHideToggleText: offerDescription?.hideToggleLabel,
                                    packageShowToggleText: offerDescription?.showToggleLabel,
                                },
                                addonHeaderOverride: info.addonHeaderOverride,
                                presentation: info.presentation,
                                numberOfBullets: info.numberOfBullets,
                            });
                        });
                    });
                    this._store.dispatch(setOfferInfoForOffers({ offersInfo: offersInfoArray }));
                }),
                catchError((error) => {
                    if (error.status === 400) {
                        this._store.dispatch(loadOffersInfo400Error({ error }));
                    }
                    return throwError(error);
                })
            );
    }
}
