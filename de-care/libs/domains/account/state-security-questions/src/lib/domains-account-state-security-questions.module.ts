import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { SecurityQuestionsEffects } from './state/effects';
import { featureKey, reducer } from './state/reducer';

@NgModule({
    imports: [CommonModule, StoreModule.forFeature(featureKey, reducer), EffectsModule.forFeature([SecurityQuestionsEffects])]
})
export class DomainsAccountStateSecurityQuestionsModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': {
                ...require('./i18n/security-questions.en-CA.json')
            },
            'en-US': {
                ...require('./i18n/security-questions.en-US.json')
            },
            'fr-CA': {
                ...require('./i18n/security-questions.fr-CA.json')
            }
        };
        super(translateService, languages);
    }
}
