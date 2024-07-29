import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { LANGUAGE_CODES } from '@de-care/shared/translation';
import { registerLocaleData } from '@angular/common';
import localeEnCa from '@angular/common/locales/en-CA';
import localeEnCaExtra from '@angular/common/locales/extra/en-CA';
import localeFrCaExtra from '@angular/common/locales/extra/fr-CA';
import localeFrCa from '@angular/common/locales/fr-CA';

@NgModule({
    imports: [TranslateModule.forRoot()],
})
export class ComponentTestTranslateModule {
    constructor(translateService: TranslateService) {
        registerLocaleData(localeFrCa, localeFrCaExtra);
        registerLocaleData(localeEnCa, localeEnCaExtra);
        translateService.setDefaultLang(LANGUAGE_CODES.DEFAULT.US);
        translateService.use(LANGUAGE_CODES.DEFAULT.US);
    }

    static forRoot(options: { languages?: string[] } = { languages: ['en-US'] }): ModuleWithProviders<ComponentTestTranslateModule> {
        // TODO: add more logic for supporting language decisions and dependencies
        return {
            ngModule: ComponentTestTranslateModule,
            providers: [{ provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: options?.languages } }],
        };
    }
}
