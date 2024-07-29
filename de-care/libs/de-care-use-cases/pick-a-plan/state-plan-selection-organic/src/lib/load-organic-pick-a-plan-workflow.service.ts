import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { iif, Observable, of } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { concatMap, map, switchMap, take } from 'rxjs/operators';
import { LoadOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { getLandingPageInboundUrlParams } from './state/selectors/state.selectors';
import { SettingsService } from '@de-care/settings';
import { DataUtilityService } from '@de-care/data-services';
import { provinceChanged } from '@de-care/domains/customer/state-locale';
import { CountrySettingsToken, COUNTRY_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { setCanUseDetailedGrid } from './state/actions';

@Injectable({ providedIn: 'root' })
export class LoadOrganicPickAPlanWorkflowService implements DataWorkflow<string, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _loadOffersWithCms: LoadOffersWithCmsContent,
        private _settingsService: SettingsService,
        private _dataUtilityService: DataUtilityService,
        @Inject(COUNTRY_SETTINGS) private readonly _countrySettings: CountrySettingsToken
    ) {
        this._store.dispatch(setCanUseDetailedGrid({ canUseDetailedGrid: this._countrySettings.countryCode.toLowerCase() === 'us' }));
    }

    build(province?: string): Observable<boolean> {
        return this._store.pipe(
            select(getLandingPageInboundUrlParams),
            take(1),
            concatMap(({ programCode, promocode }) => {
                return iif(() => this._settingsService.isCanadaMode && !province, this._dataUtilityService.getIp2LocationInfo({}), of(null)).pipe(
                    switchMap((iplocation) => {
                        if (!province && iplocation) {
                            province = iplocation;
                            this._store.dispatch(provinceChanged({ province }));
                        }
                        return this._loadOffersWithCms
                            .build({
                                programCode,
                                marketingPromoCode: promocode,
                                streaming: false,
                                student: false,
                                province,
                            })
                            .pipe(map(() => true));
                    })
                );
            })
        );
    }
}
