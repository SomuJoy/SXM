import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { formatAndSetLangPrefFromUrlParam } from '../state/checkout-triage.actions';
import { sxmCountries, getCountry } from '@de-care/shared/state-settings';
import { LANGUAGE_CODES } from '@de-care/shared/translation';
import { userSetLanguage } from '@de-care/domains/customer/state-locale';
import { map, withLatestFrom, filter, mapTo } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { ROUTER_REQUEST, RouterRequestAction } from '@ngrx/router-store';

@Injectable()
export class FormatAndSetLangEffects {
    constructor(private readonly _actions$: Actions, private readonly _store: Store) {}

    listenForRouteMatch$ = createEffect(() =>
        this._actions$.pipe(
            ofType(ROUTER_REQUEST),
            filter(
                (route: RouterRequestAction) =>
                    route.payload.routerState.url.includes('/subscribe/checkout/streaming/ineligible-redirect') ||
                    route.payload.routerState.url.includes('/subscribe/checkout/flepz/ineligible-redirect')
            ),
            mapTo(formatAndSetLangPrefFromUrlParam())
        )
    );

    formatAndSetLang$ = createEffect(() =>
        this._actions$.pipe(
            ofType(formatAndSetLangPrefFromUrlParam),
            withLatestFrom(this._store.select(getCountry), this._store.select(getNormalizedQueryParams)),
            map(([_, country, { langpref }]) => this._getLangCode(langpref as string, country))
        )
    );

    private _getLangCode(langPref: string, country: sxmCountries) {
        const defaultLang = LANGUAGE_CODES.DEFAULT[country.toUpperCase()];

        if (langPref) {
            const langPrefParam = this._parseLangPref(langPref, country);
            const lang = LANGUAGE_CODES[langPrefParam] || defaultLang;
            return userSetLanguage({ lang });
        }

        return userSetLanguage({ lang: defaultLang });
    }

    private _parseLangPref(langPrefParam: string, failOverCountry: string) {
        if (!langPrefParam) {
            return null;
        }

        const [lang, possibleCountry] = langPrefParam.split('-');
        const country = possibleCountry || failOverCountry;
        return `${lang?.toUpperCase()}_${country.toUpperCase()}`;
    }
}
