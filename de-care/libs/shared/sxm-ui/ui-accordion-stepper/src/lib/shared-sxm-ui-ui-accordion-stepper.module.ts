import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SxmUiAccordionStepComponent } from './accordion-stepper/accordion-step.component';
import { SxmUiAccordionStepperComponent } from './accordion-stepper/accordion-stepper.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModuleWithTranslation, LanguageResources } from '@de-care/shared/translation';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [SxmUiAccordionStepperComponent, SxmUiAccordionStepComponent],
    exports: [SxmUiAccordionStepperComponent, SxmUiAccordionStepComponent],
})
export class SharedSxmUiUiAccordionStepperModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
