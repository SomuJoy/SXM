import { Inject, Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { TRANSLATION_SETTINGS, TranslationSettingsToken } from '@de-care/shared/configuration-tokens-locales';
import { SxmLanguages } from './module-with-translation.module';
import { ComponentWithLocale } from './decorators';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { LANGUAGE_CODES } from './language-codes';

@Injectable({ providedIn: 'root' })
export class TranslationsForComponentService {
    constructor(private readonly _translationService: TranslateService, @Inject(TRANSLATION_SETTINGS) private readonly _translationSettings: TranslationSettingsToken) {}

    currentLang$ = this._translationService.onLangChange.pipe(
        startWith({
            lang: this._translationService.currentLang,
            translations: null,
        } as LangChangeEvent),
        map((event) => event?.lang)
    );
    langsToSwitchTo$ = this.currentLang$.pipe(
        map(() => {
            // NOTE: The startWith value coming from currentLang$ is not always correct, instead we will take the currentLang directly from the translate service
            const currentLang = this._translationService.currentLang;
            return this._translationSettings?.languagesSupported?.filter((lang) => lang !== currentLang);
        }),
        map((langs) => langs.map((lang) => ({ text: lang.split('-')[0], key: lang })))
    );

    dateFormat$ = this.currentLang$.pipe(
        map((language) => {
            switch (language) {
                case LANGUAGE_CODES.EN_CA:
                    return 'MMMM d, y';
                case LANGUAGE_CODES.EN_US:
                    return 'MM/dd/y';
                case LANGUAGE_CODES.FR_CA:
                    return 'd MMMM y';
                default:
                    return 'MM/dd/y';
            }
        })
    );

    get currentLang() {
        return this._translationService.currentLang;
    }

    get currentCountryCode$() {
        return this.currentLang$.pipe(
            map((lang) => lang || this._translationService.currentLang),
            map((lang) => lang?.split('-')?.[1]?.toLowerCase())
        );
    }

    canToggleLang = this._translationSettings.canToggleLanguage;

    init(instance: ComponentWithLocale) {
        this._translationSettings.languagesSupported.forEach((language: SxmLanguages) => {
            if (instance.languageResources[language]) {
                // If the translation entry for the locale and component does not exist in the TranslateService translations, add it
                if (!this._translationService.translations[language]?.[instance.translateKeyPrefix]) {
                    this._translationService.setTranslation(language, { [instance.translateKeyPrefix]: instance.languageResources[language] }, true);
                }
            }
        });
    }

    instant(key: string | Array<string>, interpolateParams?: unknown): string | any {
        return this._translationService.instant(key, interpolateParams);
    }

    stream(key: string | Array<string>, interpolateParams?: unknown): Observable<string | any> {
        return this._translationService.stream(key, interpolateParams);
    }

    setCurrentLang(lang: string) {
        this._translationService.use(lang);
    }

    hasKey(key: string): boolean {
        return this._translationService.instant(key) != key;
    }
}
