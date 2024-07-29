import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { SxmUiStepperComponent } from './stepper/stepper.component';
import { SxmUiStepComponent } from './stepper/step.component';
import { SxmUiStepperProgressBreadcrumbComponent } from './stepper-progress-breadcrumb/stepper-progress-breadcrumb.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SxmUiStepAccordionComponent } from './stepper-accordion/step-accordion.component';
import { SxmUiStepperAccordionComponent } from './stepper-accordion/stepper-accordion.component';
import { SxmUiStepHeaderComponent } from './step-header/step-header.component';

@NgModule({
    imports: [CommonModule, CdkStepperModule, TranslateModule.forChild()],
    declarations: [
        SxmUiStepperComponent,
        SxmUiStepComponent,
        SxmUiStepperProgressBreadcrumbComponent,
        SxmUiStepperAccordionComponent,
        SxmUiStepAccordionComponent,
        SxmUiStepHeaderComponent,
    ],
    exports: [
        SxmUiStepperComponent,
        SxmUiStepComponent,
        SxmUiStepperProgressBreadcrumbComponent,
        SxmUiStepperAccordionComponent,
        SxmUiStepAccordionComponent,
        SxmUiStepHeaderComponent,
    ],
})
export class SharedSxmUiUiStepperModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
