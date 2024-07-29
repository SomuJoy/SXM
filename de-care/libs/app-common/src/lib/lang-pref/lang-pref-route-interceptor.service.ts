import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mapTo, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { NormalizeLangPrefHelperService } from './normalize-lang-pref-helper.service';
import { UrlHelperService } from '../url-helper.service';

@Injectable()
export class LangPrefRouteInterceptorService {
    langPref$: Observable<null>;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _settingsService: SettingsService,
        private _urlHelperService: UrlHelperService,
        private _normalizeLangPrefHelperService: NormalizeLangPrefHelperService,
        private _translateService: TranslateService,
        private _userSettingsService: UserSettingsService
    ) {
        this.langPref$ = this._activatedRoute.queryParamMap.pipe(
            tap(queryParamMap => {
                const langPref = this._urlHelperService.getCaseInsensitiveParam(queryParamMap, 'langPref');
                if (!!langPref) {
                    const country = this._settingsService.settings.country.toUpperCase();
                    const normalizedLangPref = this._normalizeLangPrefHelperService.normalize(langPref, country);
                    this._translateService.use(normalizedLangPref);
                    this._userSettingsService.setDateFormatBasedOnLocale(normalizedLangPref);
                }
            }),
            mapTo(null)
        );
    }
}
