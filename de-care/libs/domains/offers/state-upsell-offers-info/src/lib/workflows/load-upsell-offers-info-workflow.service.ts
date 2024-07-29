import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataUpsellOffersInfoService } from '../data-services/data-upsell-offers-info.service';
import { setUpsellOfferInfoForUpsellOffers } from '../state/actions';
import { UpsellOfferInfoModel } from '../state/reducer';
import { ListeningOptionsMapperService } from '../listening-options-mapper.service';
import { TermCopyMapperService } from '../term-copy-mapper.service';
import { normalizeLangToLocaleForServiceCall, normalizeLocaleToLanguageAndCountryOnly } from '@de-care/domains/offers/state-offers-info-common';

export interface WorkflowRequest {
    leadOfferPlanCode: string;
    packageUpsellPlanCode?: string;
    termUpsellPlanCode?: string;
    packageAndTermUpsellPlanCode?: string;
    province?: string;
    locales: string[];
    country: string;
}

@Injectable({ providedIn: 'root' })
export class LoadUpsellOffersInfoWorkflowService implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(
        private readonly _dataUpsellOffersInfoService: DataUpsellOffersInfoService,
        private readonly _store: Store,
        private readonly _listeningOptionsMapperService: ListeningOptionsMapperService,
        private readonly _termCopyMapperService: TermCopyMapperService
    ) {}

    build(request: WorkflowRequest): Observable<boolean> {
        const { country, ...requestPayload } = request;
        const locales = request.locales.map((locale) => normalizeLangToLocaleForServiceCall(locale, country, request?.province));
        return this._dataUpsellOffersInfoService.getUpsellOffersInfo({ ...requestPayload, locales }).pipe(
            map((response) => {
                const upsellOffersInfo: UpsellOfferInfoModel[] = [];
                response.forEach((localeItem) => {
                    const { upsellOfferInfo } = localeItem;
                    const { packageUpsellOfferInfo, termUpsellOfferInfo, packageAndTermUpsellOfferInfo } = upsellOfferInfo;
                    upsellOffersInfo.push(<UpsellOfferInfoModel>{
                        locale: normalizeLocaleToLanguageAndCountryOnly(localeItem.locale),
                        leadOfferPlanCode: request.leadOfferPlanCode,
                        packageUpsellOfferInfo: packageUpsellOfferInfo
                            ? {
                                  header: packageUpsellOfferInfo.header,
                                  title: packageUpsellOfferInfo.title,
                                  description: packageUpsellOfferInfo.description,
                                  packageDescription: {
                                      descriptionTitle: packageUpsellOfferInfo.highlightsTitle,
                                      highlightsText: packageUpsellOfferInfo.highlightsText,
                                      listeningOptions: this._listeningOptionsMapperService.mapListeningOptionsToTextCopy(
                                          packageUpsellOfferInfo.listeningOptions,
                                          localeItem.locale
                                      ),
                                  },
                                  toggleCollapsed: packageUpsellOfferInfo.showToggleLabel,
                                  toggleExpanded: packageUpsellOfferInfo.hideToggleLabel,
                                  upsellDeals: packageUpsellOfferInfo.upsellDeals,
                              }
                            : null,
                        termUpsellOfferInfo: this._termCopyMapperService.mapTermCopy(termUpsellOfferInfo),
                        packageAndTermUpsellOfferInfo: packageAndTermUpsellOfferInfo
                            ? {
                                  packageUpsellOfferInfo: {
                                      header: packageAndTermUpsellOfferInfo.packageUpsellOfferInfo.header,
                                      title: packageAndTermUpsellOfferInfo.packageUpsellOfferInfo.title,
                                      description: packageAndTermUpsellOfferInfo.packageUpsellOfferInfo.description,
                                      packageDescription: {
                                          descriptionTitle: packageAndTermUpsellOfferInfo.packageUpsellOfferInfo.highlightsTitle,
                                          highlightsText: packageAndTermUpsellOfferInfo.packageUpsellOfferInfo.highlightsText,
                                          listeningOptions: this._listeningOptionsMapperService.mapListeningOptionsToTextCopy(
                                              packageAndTermUpsellOfferInfo.packageUpsellOfferInfo.listeningOptions,
                                              localeItem.locale
                                          ),
                                      },
                                      toggleCollapsed: packageAndTermUpsellOfferInfo.packageUpsellOfferInfo.showToggleLabel,
                                      toggleExpanded: packageAndTermUpsellOfferInfo.packageUpsellOfferInfo.hideToggleLabel,
                                      upsellDeals: packageAndTermUpsellOfferInfo.packageUpsellOfferInfo.upsellDeals,
                                  },
                                  termUpsellOfferInfo: this._termCopyMapperService.mapTermCopy(packageAndTermUpsellOfferInfo.termUpsellOfferInfo),
                              }
                            : null,
                    });
                });
                this._store.dispatch(setUpsellOfferInfoForUpsellOffers({ upsellOffersInfo }));
                return true;
            })
        );
    }
}
