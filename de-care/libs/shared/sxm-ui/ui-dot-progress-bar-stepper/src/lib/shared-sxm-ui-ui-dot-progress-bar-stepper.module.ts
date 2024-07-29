import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithTranslation, LanguageResources } from '@de-care/app-common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DotProgressBarStepperComponent } from './dot-progress-bar-stepper/dot-progress-bar-stepper.component';
import { DotProgressBarStepComponent } from './dot-progress-bar-stepper/dot-progress-bar-step.component';
import { SharedSxmUiUiDotProgressBarModule } from '@de-care/shared/sxm-ui/ui-dot-progress-bar';
import { CdkStepperModule } from '@angular/cdk/stepper';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiDotProgressBarModule, CdkStepperModule],
    declarations: [DotProgressBarStepperComponent, DotProgressBarStepComponent],
    exports: [DotProgressBarStepperComponent, DotProgressBarStepComponent]
})
export class SharedSxmUiUiDotProgressBarStepperModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
