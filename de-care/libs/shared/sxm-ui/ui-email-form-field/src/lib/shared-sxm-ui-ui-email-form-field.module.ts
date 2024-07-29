import { SharedSxmUiUiTrimFormFieldModule } from '@de-care/shared/sxm-ui/ui-trim-form-field';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiEmailFormFieldComponent } from './email-form-field/email-form-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiInputFocusModule } from '@de-care/shared/sxm-ui/ui-input-focus';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedSxmUiUiInputFocusModule, TranslateModule.forChild(), SharedSxmUiUiTrimFormFieldModule],
    declarations: [SxmUiEmailFormFieldComponent],
    exports: [SxmUiEmailFormFieldComponent]
})
export class SharedSxmUiUiEmailFormFieldModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json')
        };
        super(translateService, languages);
    }
}
