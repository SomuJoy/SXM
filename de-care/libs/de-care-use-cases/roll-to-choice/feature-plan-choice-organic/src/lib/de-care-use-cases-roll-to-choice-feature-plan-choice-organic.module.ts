import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { RouterModule } from '@angular/router';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomainsOffersUiHeroModule } from '@de-care/domains/offers/ui-hero';
import { SalesCommonModule } from '@de-care/sales-common';
import { LandingPageCanActivate } from './landing-page-can-activate';
import { DeCareUseCasesRollToChoiceStatePlanChoiceOrganicModule } from '@de-care/de-care-use-cases/roll-to-choice/state-plan-choice-organic';
import { FindYourAccountCardComponent } from './page-parts/find-your-account-card/find-your-account-card.component';
import { IdentificationModule } from '@de-care/identification';
import { OffersModule } from '@de-care/offers';
import { IntersectionObserverModule } from '@de-care/shared/browser-common/intersection-observer';
import { DomainsUtilityStateEnvironmentInfoModule } from '@de-care/domains/utility/state-environment-info';
import { PlanChoiceOrganicNavigationService } from './plan-choice-organic-navigation.service';
import { SharedSxmUiUiPlanComparisonGridModule } from '@de-care/shared/sxm-ui/ui-plan-comparison-grid';
import { SharedSxmUiUiFollowOnSelectionModule } from '@de-care/shared/sxm-ui/ui-follow-on-selection';
import { SharedSxmUiUiWithoutPlatformNamePipeModule, WithoutPlatformNamePipe } from '@de-care/shared/sxm-ui/ui-without-platform-name-pipe';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                canActivate: [LandingPageCanActivate],
                component: LandingPageComponent,
            },
        ]),
        TranslateModule.forChild(),
        DomainsOffersUiHeroModule,
        SalesCommonModule,
        IdentificationModule,
        OffersModule, // TODO: see about moving plan comparison grid out of this module so we can just import a smaller module
        DeCareUseCasesRollToChoiceStatePlanChoiceOrganicModule,
        DomainsUtilityStateEnvironmentInfoModule,
        SharedSxmUiUiPlanComparisonGridModule,
        SharedSxmUiUiFollowOnSelectionModule,
        SharedSxmUiUiWithoutPlatformNamePipeModule,
        IntersectionObserverModule,
    ],
    providers: [LandingPageCanActivate, PlanChoiceOrganicNavigationService, WithoutPlatformNamePipe],
    declarations: [LandingPageComponent, FindYourAccountCardComponent],
})
export class DeCareUseCasesRollToChoiceFeaturePlanChoiceOrganicModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
