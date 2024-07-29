import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithoutVehicleMakePipe } from './without-vehicle-make.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [WithoutVehicleMakePipe],
    exports: [WithoutVehicleMakePipe]
})
export class SharedSxmUiUiWithoutVehicleMakeModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json')
        };
        super(translateService, languages);
    }
}
