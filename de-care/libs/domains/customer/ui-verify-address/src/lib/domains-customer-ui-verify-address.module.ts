import { ModuleWithTranslation, PackageDescriptionTranslationsService, LanguageResources } from '@de-care/app-common';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyAddressComponent } from './verify-address/verify-address.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), FormsModule, ReactiveFormsModule],
    declarations: [VerifyAddressComponent],
    exports: [VerifyAddressComponent],
})
/**
 * @deprecated Use SxmUiVerifyAddressComponentModule from libs/shared/sxm-ui/ui-verify-address/src/lib/verify-address/verify-address.component
 */
export class DomainsCustomerUiVerifyAddressModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/verify-address.en-CA.json'),
            'en-US': require('./i18n/verify-address.en-US.json'),
            'fr-CA': require('./i18n/verify-address.fr-CA.json'),
        };
        super(translateService, languages);

        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
