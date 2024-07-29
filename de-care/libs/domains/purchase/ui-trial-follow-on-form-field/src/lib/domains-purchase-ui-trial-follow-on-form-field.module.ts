import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiModule } from '@de-care/sxm-ui';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LanguageResources, ModuleWithTranslation, PackageDescriptionTranslationsService } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TrialFollowOnFormFieldComponent } from './trial-follow-on-form-field/trial-follow-on-form-field.component';
import { RemoveSiriusXmPrefixPipe } from './trial-follow-on-form-field/remove-sirius-xm-prefix.pipe';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SxmUiModule, ReactiveFormsModule, FormsModule],
    declarations: [TrialFollowOnFormFieldComponent, RemoveSiriusXmPrefixPipe],
    exports: [TrialFollowOnFormFieldComponent]
})
export class DomainsPurchaseUiTrialFollowOnFormFieldModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/ui-trial-follow-on-form-field.en-CA.json'),
            'en-US': require('./i18n/ui-trial-follow-on-form-field.en-US.json'),
            'fr-CA': require('./i18n/ui-trial-follow-on-form-field.fr-CA.json')
        };
        super(translateService, languages);
        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
