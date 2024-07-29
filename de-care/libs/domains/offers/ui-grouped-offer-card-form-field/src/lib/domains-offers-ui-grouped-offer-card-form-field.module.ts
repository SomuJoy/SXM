import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { PackageDescriptionTranslationsService } from '@de-care/app-common';
import { SxmUiModule } from '@de-care/sxm-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UIGroupedOfferCardFormFieldComponent } from './ui-grouped-offer-card-form-field-component/ui-grouped-offer-card-form-field.component';
import { DomainsOffersUiPlanDescriptionChannelsModule } from '@de-care/domains/offers/ui-plan-description-channels';
import { DomainsOffersUiPlanGridModule } from '@de-care/domains/offers/ui-plan-grid';
import { DomainsOffersUiOfferDescriptionModule } from '@de-care/domains/offers/ui-offer-description';
import { SharedSxmUiUiRadioOptionWithTooltipFormFieldSetModule } from '@de-care/shared/sxm-ui/ui-radio-option-with-tooltip-form-field-set';

const DECLARATIONS = [UIGroupedOfferCardFormFieldComponent];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SxmUiModule,
        DomainsOffersUiPlanDescriptionChannelsModule,
        DomainsOffersUiPlanGridModule,
        DomainsOffersUiOfferDescriptionModule,
        SharedSxmUiUiRadioOptionWithTooltipFormFieldSetModule
    ],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS]
})
export class DomainsOffersUiGroupedOfferCardFormFieldModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/ui-grouped-offer-card-form-field.en-CA.json'),
            'en-US': require('./i18n/ui-grouped-offer-card-form-field.en-US.json'),
            'fr-CA': require('./i18n/ui-grouped-offer-card-form-field.fr-CA.json')
        };
        super(translateService, languages);
        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
