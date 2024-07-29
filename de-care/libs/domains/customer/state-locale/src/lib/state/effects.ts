import { Injectable } from '@angular/core';
import { selectQueryParams } from '@de-care/shared/state-router-store';
import { getCountry, getIsCanadaMode, LANGUAGE_CODES } from '@de-care/shared/state-settings';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, EMPTY } from 'rxjs';
import { catchError, concatMap, filter, flatMap, map, take, withLatestFrom } from 'rxjs/operators';
import {
    provinceListChanged,
    setProvinceSelectionVisible,
    setProvinceSelectionVisibleIfCanada,
    translationServiceLanguageChange,
    userSetLanguage,
    getIpToLocationInfo,
    provinceChanged,
    setPageStartingProvince,
    setProvinceSelectionDisabled,
} from './actions';
import { IpToLocationService } from '../data-services/get-ip2location.service';

function parseLangPref(langPrefParam: string, failoverCountry: string) {
    if (!langPrefParam) {
        return null;
    }

    const [lang, possibleCountry] = langPrefParam.split('-');

    const country = possibleCountry || failoverCountry;

    return `${lang?.toUpperCase()}_${country.toUpperCase()}`;
}

@Injectable()
export class CustomerLocaleEffects {
    constructor(
        private readonly _translateService: TranslateService,
        private readonly _actions$: Actions,
        private readonly _store: Store,
        private readonly _ipToLocationService: IpToLocationService
    ) {}

    langChangeDetected$ = createEffect(() => this._translateService.onLangChange.pipe(map((langChangeEvt) => translationServiceLanguageChange({ lang: langChangeEvt.lang }))));
    provinceListChanged$ = createEffect(() =>
        this._translateService.stream('SharedTranslationsUtilCountrySubdivisionsModule.countrySubdivisions').pipe(map((provinces) => provinceListChanged({ provinces })))
    );

    userSetLanguage$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(userSetLanguage),
                concatMap(({ lang }) => this._translateService.use(lang))
            ),
        { dispatch: false }
    );

    setProvinceSelectionVisibleIfCanada$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setProvinceSelectionVisibleIfCanada),
            withLatestFrom(this._store.pipe(select(getIsCanadaMode))),
            filter(([_, isCanada]) => isCanada === true),
            map(([{ isVisible }, _]) => setProvinceSelectionVisible({ isVisible }))
        )
    );

    // TODO: move this out of state-locale so lib doesn't require Angular router
    //       and can be used in apps/elements where router is not used.
    //       Can expose a new action for setting from langPref structured string.
    langPrefInQueryString$ = createEffect(() =>
        combineLatest([
            this._actions$.pipe(ofType(ROUTER_NAVIGATION)),
            this._store.pipe(select(selectQueryParams)),
            this._store.pipe(
                select(getCountry),
                filter((countryFromAppSettings) => !!countryFromAppSettings)
            ),
        ]).pipe(
            take(1),
            map(([_, queryParams, countryFromAppSettings]) => {
                const defaultLang = LANGUAGE_CODES.DEFAULT[countryFromAppSettings.toUpperCase()];

                if (queryParams.langPref) {
                    const langPrefParam = parseLangPref(queryParams.langPref, countryFromAppSettings);

                    const lang = LANGUAGE_CODES[langPrefParam] || defaultLang;

                    return userSetLanguage({ lang });
                }

                return userSetLanguage({ lang: defaultLang });
            }),
            catchError(() => EMPTY)
        )
    );

    loadIpToLocationInfo = createEffect(() =>
        this._actions$.pipe(
            ofType(getIpToLocationInfo),
            map((data) => {
                return {
                    ipAddress: data.ipAddress,
                };
            }),
            concatMap((ipAddress) => this._ipToLocationService.getIp2LocationInfo(ipAddress)),
            map((province) => provinceChanged({ province }))
        )
    );

    setPageStartingProvince = createEffect(() =>
        this._actions$.pipe(
            ofType(setPageStartingProvince),
            flatMap(({ province, isDisabled }) => [
                setProvinceSelectionVisible({ isVisible: true }),
                setProvinceSelectionDisabled({ isDisabled }),
                provinceChanged({ province }),
            ])
        )
    );
}
