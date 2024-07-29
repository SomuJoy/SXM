import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { SweepstakesRegistrationFormComponent } from './sweepstakes-registration-form/sweepstakes-registration-form.component';
import { SxmUiModule } from '@de-care/sxm-ui';
import { ReactiveFormsModule } from '@angular/forms';
import { DataSweepstakesService } from '@de-care/data-services';

const DECLARATIONS = [SweepstakesRegistrationFormComponent];
@NgModule({
    imports: [TranslateModule.forChild(), CommonModule, SxmUiModule, ReactiveFormsModule],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS],
    //TODO: DataSweepstakesService is provided in root. Check modules hirearchy and consider to remove it from providers at this level.
    providers: [DataSweepstakesService]
})
export class SweepstakesModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': {
                ...require('./i18n/sweepstakes.en-CA.json')
            },
            'en-US': {
                ...require('./i18n/sweepstakes.en-US.json')
            },
            'fr-CA': {
                ...require('./i18n/sweepstakes.fr-CA.json')
            }
        };
        super(translateService, languages);
    }
}
