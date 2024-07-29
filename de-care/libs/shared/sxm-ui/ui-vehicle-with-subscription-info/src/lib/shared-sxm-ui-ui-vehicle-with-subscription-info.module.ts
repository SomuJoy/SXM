import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleWithSubscriptionInfoComponent } from './vehicle-with-subscription-info/vehicle-with-subscription-info.component';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { PackageDescriptionTranslationsService } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedSxmUiUiListenerDetailsModule } from '@de-care/shared/sxm-ui/ui-listener-details';
import { SharedSxmUiUiWithoutPlatformNamePipeModule } from '@de-care/shared/sxm-ui/ui-without-platform-name-pipe';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiListenerDetailsModule, SharedSxmUiUiWithoutPlatformNamePipeModule],
    declarations: [VehicleWithSubscriptionInfoComponent],
    exports: [VehicleWithSubscriptionInfoComponent]
})
export class SharedSxmUiUiVehicleWithSubscriptionInfoModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json')
        };
        super(translateService, languages);
        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
