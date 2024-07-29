import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SharedSxmUiUiRadioOptionWithTooltipFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-with-tooltip-form-field';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiChooseGenreFormComponent } from './choose-genre-form/choose-genre-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiRadioOptionWithTooltipFormFieldSetModule } from '@de-care/shared/sxm-ui/ui-radio-option-with-tooltip-form-field-set';

@NgModule({
    declarations: [SxmUiChooseGenreFormComponent],
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
        SharedSxmUiUiRadioOptionWithTooltipFormFieldModule,
        SharedValidationFormControlInvalidModule,
        SharedSxmUiUiRadioOptionWithTooltipFormFieldSetModule
    ],
    exports: [SxmUiChooseGenreFormComponent]
})
export class SharedSxmUiUiChooseGenreFormModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json')
        };
        super(translateService, languages);
    }
}
