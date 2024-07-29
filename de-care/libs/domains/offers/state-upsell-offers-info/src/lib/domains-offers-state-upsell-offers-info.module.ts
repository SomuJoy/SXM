import { NgModule } from '@angular/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { setCurrentLocale } from './state/actions';
import { Effects } from './state/effects';
import { featureKey, reducer } from './state/reducer';

@NgModule({
    imports: [TranslateModule.forChild(), StoreModule.forFeature(featureKey, reducer), EffectsModule.forFeature([Effects])],
})
export class DomainsOffersStateUpsellOffersInfoModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, store: Store) {
        store.dispatch(setCurrentLocale({ locale: translateService.currentLang }));
        translateService.onLangChange.subscribe({
            next: ({ lang: locale }) => store.dispatch(setCurrentLocale({ locale })),
        });
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
