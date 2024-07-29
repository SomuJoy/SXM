import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiNflOptInComponent } from './nfl-opt-in/nfl-opt-in.component';
import { SharedSxmUiUiCheckboxWithLabelFormFieldModule } from '@de-care/shared/sxm-ui/ui-checkbox-with-label-form-field';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';

@NgModule({
    imports: [CommonModule, SharedSxmUiUiCheckboxWithLabelFormFieldModule, TranslateModule.forChild(), FormsModule, ReactiveFormsModule],
    declarations: [SxmUiNflOptInComponent],
    exports: [SxmUiNflOptInComponent],
})
export class SharedSxmUiUiNflOptInModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
