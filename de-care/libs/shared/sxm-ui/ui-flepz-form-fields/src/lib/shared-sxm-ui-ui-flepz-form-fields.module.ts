import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiFlepzFormFieldsComponent } from './flepz-form-fields/flepz-form-fields.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { SharedSxmUiUiInputFocusModule } from '@de-care/shared/sxm-ui/ui-input-focus';
import { SharedSxmUiUiFormFieldMasksModule } from '@de-care/shared/sxm-ui/ui-form-field-masks';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { SharedSxmUiUiTrimFormFieldModule } from '@de-care/shared/sxm-ui/ui-trim-form-field';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedValidationFormControlInvalidModule,
        SharedSxmUiUiInputFocusModule,
        SharedSxmUiUiFormFieldMasksModule,
        SharedSxmUiUiTrimFormFieldModule
    ],
    declarations: [SxmUiFlepzFormFieldsComponent],
    exports: [SxmUiFlepzFormFieldsComponent]
})
export class SharedSxmUiUiFlepzFormFieldsModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json')
        };
        super(translateService, languages);
    }
}
