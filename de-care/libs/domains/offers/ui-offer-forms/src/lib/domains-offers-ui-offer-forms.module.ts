import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiContentCardModule } from '@de-care/shared/sxm-ui/ui-content-card';
import { SharedSxmUiUiRadioOptionWithTooltipFormFieldSetModule } from '@de-care/shared/sxm-ui/ui-radio-option-with-tooltip-form-field-set';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { PlanCodeOptionsToRadioInputOptionsPipe } from './pipes/plan-code-options-to-radio-input-options.pipe';
import { ToLegacyPackageDataForPrimaryPackageCard } from './pipes/to-legacy-package-data-for-primary-package-card.pipe';
import { MultiOfferSelectionFormComponent } from './multi-offer-selection-form/multi-offer-selection-form.component';
import { OfferCardFormFieldOptionComponent } from './offer-card-form-field-option/offer-card-form-field-option.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiAccordionChevronModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiContentCardModule,
        SharedSxmUiUiRadioOptionFormFieldModule,
        SharedSxmUiUiRadioOptionWithTooltipFormFieldSetModule,
        SharedSxmUiUiPrimaryPackageCardModule
    ],
    declarations: [MultiOfferSelectionFormComponent, OfferCardFormFieldOptionComponent, PlanCodeOptionsToRadioInputOptionsPipe, ToLegacyPackageDataForPrimaryPackageCard],
    exports: [MultiOfferSelectionFormComponent, OfferCardFormFieldOptionComponent]
})
export class DomainsOffersUiOfferFormsModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json')
        };
        super(translateService, languages);
    }
}
