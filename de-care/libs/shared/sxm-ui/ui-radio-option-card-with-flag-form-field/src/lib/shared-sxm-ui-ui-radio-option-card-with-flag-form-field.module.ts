import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedSxmUiUiContentCardModule } from '@de-care/shared/sxm-ui/ui-content-card';
import { RadioOptionCardWithFlagFormFieldComponent } from './radio-option-card-with-flag-form-field/radio-option-card-with-flag-form-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { PackageDescriptionTranslationsService } from '@de-care/app-common';
import { SharedSxmUiUiWithoutPlatformNamePipeModule } from '@de-care/shared/sxm-ui/ui-without-platform-name-pipe';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), ReactiveFormsModule, SharedSxmUiUiContentCardModule, SharedSxmUiUiWithoutPlatformNamePipeModule],
    declarations: [RadioOptionCardWithFlagFormFieldComponent],
    exports: [RadioOptionCardWithFlagFormFieldComponent]
})
export class SharedSxmUiUiRadioOptionCardWithFlagFormFieldModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };
        super(translateService, languages);
        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
