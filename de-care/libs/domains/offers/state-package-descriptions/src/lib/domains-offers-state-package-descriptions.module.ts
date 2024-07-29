import { NgModule, Inject } from '@angular/core';
import { StoreModule, Store } from '@ngrx/store';
import { featureKey, reducer } from './state/reducer';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationSettingsToken, TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { setCurrentLocale } from './state/actions';
import { locales } from './state/models';

@NgModule({
    imports: [TranslateModule.forChild(), StoreModule.forFeature(featureKey, reducer)],
})
export class DomainsOffersStatePackageDescriptionsModule {
    constructor(translateService: TranslateService, store: Store, @Inject(TRANSLATION_SETTINGS) translationSettingsToken: TranslationSettingsToken) {
        if (!Array.isArray(translationSettingsToken?.languagesSupported) || translationSettingsToken.languagesSupported.length === 0) {
            throw new Error(`
            The supported locales were not configured. These should be provided via 
            the TRANSLATION_SETTINGS token.`);
        }
        store.dispatch(setCurrentLocale({ locale: translateService.currentLang as locales }));
        if (translationSettingsToken.languagesSupported.length > 0) {
            translateService.onLangChange.subscribe({
                next: ({ lang: locale }) => store.dispatch(setCurrentLocale({ locale })),
            });
        }
    }
}
