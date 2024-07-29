import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageResources, ModuleWithTranslation, PackageDescriptionTranslationsService } from '@de-care/app-common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { PackagesComparisonComponent } from './packages-comparison/packages-comparison.component';
import { PlanComparisonGridTooltipLinkIdPipe } from './plan-comparison-grid-tooltip-link-id.pipe';
import { SharedSxmUiUiWithoutPlatformNamePipeModule, WithoutPlatformNamePipe } from '@de-care/shared/sxm-ui/ui-without-platform-name-pipe';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { SharedSxmUiUiPlatformFromPackageNamePipeModule } from '@de-care/shared/sxm-ui/ui-platform-from-package-name-pipe';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        SharedSxmUiUiWithoutPlatformNamePipeModule,
        SharedSxmUiUiTooltipModule,
        SharedSxmUiUiPlatformFromPackageNamePipeModule
    ],
    declarations: [PackagesComparisonComponent, PlanComparisonGridTooltipLinkIdPipe],
    exports: [PackagesComparisonComponent],
    providers: [WithoutPlatformNamePipe]
})
export class SharedSxmUiUiPackagesComparisonModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
