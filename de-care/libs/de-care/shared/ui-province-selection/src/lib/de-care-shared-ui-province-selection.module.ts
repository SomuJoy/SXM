import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiDropdownFormFieldModule } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';
import { CurrentProvinceComponent } from './current-province/current-province.component';
import { ProvinceSelectionComponent } from './province-selection/province-selection.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiModalModule,
        SharedSxmUiUiDropdownFormFieldModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiProceedButtonModule,
    ],
    declarations: [CurrentProvinceComponent, ProvinceSelectionComponent],
    exports: [CurrentProvinceComponent, ProvinceSelectionComponent],
})
export class DeCareSharedUiProvinceSelectionModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
