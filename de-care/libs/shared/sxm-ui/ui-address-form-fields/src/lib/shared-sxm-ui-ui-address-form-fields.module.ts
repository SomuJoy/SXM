import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressFormFieldsComponent } from './address-form-fields/address-form-fields.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { SharedSxmUiUiDropdownFormFieldModule } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';
import { SharedSxmUiUiFormFieldMasksModule } from '@de-care/shared/sxm-ui/ui-form-field-masks';
import { SharedSxmUiUiInputFocusModule } from '@de-care/shared/sxm-ui/ui-input-focus';
import { AddressFormFieldsOemComponent } from './address-form-fields/address-form-fields-oem/address-form-fields-oem.component';
import { SharedSxmUiUiTrimFormFieldModule } from '@de-care/shared/sxm-ui/ui-trim-form-field';
import { SharedSxmUiUiZipStateDropdownFiledModule } from '@de-care/shared/sxm-ui/ui-zip-state-dropdown-filed';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedSxmUiUiFormFieldMasksModule,
        SharedSxmUiUiInputFocusModule,
        TranslateModule.forChild(),
        SharedSxmUiUiDropdownFormFieldModule,
        SharedSxmUiUiTrimFormFieldModule,
        SharedSxmUiUiZipStateDropdownFiledModule,
    ],
    declarations: [AddressFormFieldsComponent, AddressFormFieldsOemComponent],
    exports: [AddressFormFieldsComponent, AddressFormFieldsOemComponent],
})
export class SharedSxmUiUiAddressFormFieldsModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': {
                ...require('./i18n/module.en-CA.json'),
                ...require('../../../../../app-common/src/lib/i18n/app.en-CA.json'),
            },
            'en-US': {
                ...require('./i18n/module.en-US.json'),
                ...require('../../../../../app-common/src/lib/i18n/app.en-US.json'),
            },
            'fr-CA': {
                ...require('./i18n/module.fr-CA.json'),
                ...require('../../../../../app-common/src/lib/i18n/app.fr-CA.json'),
            },
        };

        super(translateService, languages);
    }
}
