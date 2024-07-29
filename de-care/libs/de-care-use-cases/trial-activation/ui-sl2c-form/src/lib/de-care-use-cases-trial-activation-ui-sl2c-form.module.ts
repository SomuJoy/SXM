import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { SxmUiModule } from '@de-care/sxm-ui';
import { Sl2cFormComponent } from './sl2c-form/sl2c-form.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation, PackageDescriptionTranslationsService } from '@de-care/app-common';
import { SharedSxmUiUiHelpFindingRadioModule } from '@de-care/shared/sxm-ui/ui-help-finding-radio';
import { CustomerInfoModule } from '@de-care/customer-info';
import { DomainsCustomerStateLocaleModule } from '@de-care/domains/customer/state-locale';
import { SharedAsyncValidatorsStateEmailVerificationModule } from '@de-care/shared/async-validators/state-email-verification';
import { SharedStateSettingsModule } from '@de-care/shared/state-settings';

@NgModule({
    imports: [
        CommonModule,
        SharedSxmUiUiTextFormFieldModule,
        SxmUiModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        CustomerInfoModule,
        SharedSxmUiUiHelpFindingRadioModule,
        FormsModule,
        SharedAsyncValidatorsStateEmailVerificationModule,
        DomainsCustomerStateLocaleModule,
        SharedStateSettingsModule
    ],
    declarations: [Sl2cFormComponent],
    exports: [Sl2cFormComponent]
})
export class DeCareUseCasesTrialActivationUiSl2cFormModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/ui-sl2c-form.en-CA.json') },
            'en-US': { ...require('./i18n/ui-sl2c-form.en-US.json') },
            'fr-CA': { ...require('./i18n/ui-sl2c-form.fr-CA.json') }
        };

        super(translateService, languages);
        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
