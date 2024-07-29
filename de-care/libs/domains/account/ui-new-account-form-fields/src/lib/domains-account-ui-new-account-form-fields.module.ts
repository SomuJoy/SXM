import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewAccountFormFieldsComponent } from './new-account-form-fields/new-account-form-fields.component';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { SxmUiModule } from '@de-care/sxm-ui';
import { DomainsAccountUiLoginFormFieldsModule } from '@de-care/domains/account/ui-login-form-fields';
import { CustomerInfoModule } from '@de-care/customer-info';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { SharedSxmUiUiPostalCodeFormWrapperModule } from '@de-care/shared/sxm-ui/ui-postal-code-form-wrapper';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SxmUiModule,
        DomainsAccountUiLoginFormFieldsModule,
        CustomerInfoModule,
        SharedSxmUiUiAddressFormFieldsModule,
        SharedSxmUiUiPostalCodeFormWrapperModule,
    ],
    declarations: [NewAccountFormFieldsComponent],
    exports: [NewAccountFormFieldsComponent],
})
export class DomainsAccountUiNewAccountFormFieldsModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, settingService: SettingsService, userSettingsService: UserSettingsService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/ui-new-account-form-fields.en-CA.json') },
            'en-US': { ...require('./i18n/ui-new-account-form-fields.en-US.json') },
            'fr-CA': { ...require('./i18n/ui-new-account-form-fields.fr-CA.json') },
        };

        if (settingService.isCanadaMode) {
            userSettingsService.setProvinceSelectionVisible(false);
        }

        super(translateService, languages);
    }
}
