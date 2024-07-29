import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeroComponent } from './hero/hero.component';
import { LanguageResources, ModuleWithTranslation, PackageDescriptionTranslationsService } from '@de-care/app-common';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [HeroComponent],
    exports: [HeroComponent]
})
export class DomainsOffersUiHeroModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/ui-hero.en-CA.json'),
            'en-US': require('./i18n/ui-hero.en-US.json'),
            'fr-CA': require('./i18n/ui-hero.fr-CA.json')
        };
        super(translateService, languages);
        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
