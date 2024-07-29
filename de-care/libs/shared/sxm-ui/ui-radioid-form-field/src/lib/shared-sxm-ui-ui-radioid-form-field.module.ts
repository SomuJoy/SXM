import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioidFormFieldValueDirective } from './radioid-form-field-value.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModuleWithTranslation, LanguageResources } from '@de-care/shared/translation';
import { SharedSxmUiUiTrimFormFieldModule } from '@de-care/shared/sxm-ui/ui-trim-form-field';
import { SxmUiRadioIdFormFieldComponent } from './radio-id-form-field/radio-id-form-field.component';
import { SxmUiMaskRadioIdDirective } from './radioid-masking-directive';
import { SxmUiTrimmedRadioIdDirective } from './radioid-trim-form-field-directive';

@NgModule({
    declarations: [RadioidFormFieldValueDirective, SxmUiRadioIdFormFieldComponent, SxmUiMaskRadioIdDirective, SxmUiTrimmedRadioIdDirective],
    exports: [RadioidFormFieldValueDirective, SxmUiRadioIdFormFieldComponent, SxmUiMaskRadioIdDirective, SxmUiTrimmedRadioIdDirective],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), SharedSxmUiUiTrimFormFieldModule],
})
export class SharedSxmUiUiRadioidFormFieldModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
