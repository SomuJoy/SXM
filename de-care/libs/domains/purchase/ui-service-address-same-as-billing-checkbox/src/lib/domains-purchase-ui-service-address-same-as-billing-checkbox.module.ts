import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiModule } from '@de-care/sxm-ui';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LanguageResources, ModuleWithTranslation, PackageDescriptionTranslationsService } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ServiceAddressSameAsBillingCheckboxComponent } from './service-address-same-as-billing-checkbox/service-address-same-as-billing-checkbox.component';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SxmUiModule, ReactiveFormsModule, FormsModule],
    declarations: [ServiceAddressSameAsBillingCheckboxComponent],
    exports: [ServiceAddressSameAsBillingCheckboxComponent]
})
export class DomainsPurchaseUiServiceAddressSameAsBillingCheckboxModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/ui-service-address-same-as-billing-checkbox.en-CA.json'),
            'en-US': require('./i18n/ui-service-address-same-as-billing-checkbox.en-US.json'),
            'fr-CA': require('./i18n/ui-service-address-same-as-billing-checkbox.fr-CA.json')
        };
        super(translateService, languages);
        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
