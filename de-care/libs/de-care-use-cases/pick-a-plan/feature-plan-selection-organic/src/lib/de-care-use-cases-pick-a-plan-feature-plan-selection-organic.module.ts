import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { RouterModule } from '@angular/router';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomainsOffersUiHeroModule } from '@de-care/domains/offers/ui-hero';
import { SalesCommonModule } from '@de-care/sales-common';
import { LandingPageCanActivate } from './landing-page-can-activate';
import { DeCareUseCasesPickAPlanStatePlanSelectionOrganicModule } from '@de-care/de-care-use-cases/pick-a-plan/state-plan-selection-organic';
import { FindYourAccountCardComponent } from './page-parts/find-your-account-card/find-your-account-card.component';
import { IdentificationModule } from '@de-care/identification';
import { PlanSelectionOrganicNavigationService } from './plan-selection-organic-navigation.service';
import { SharedSxmUiUiPickAPlanFormModule } from '@de-care/shared/sxm-ui/ui-pick-a-plan-form';
import { SxmUiPlanComparisonGridDetailedComponentModule } from '@de-care/shared/sxm-ui/ui-plan-comparison-grid-detailed';
import { IntersectionObserverModule } from '@de-care/shared/browser-common/intersection-observer';
import { ReactiveComponentModule } from '@ngrx/component';

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
        SharedSxmUiUiPickAPlanFormModule,
        SxmUiPlanComparisonGridDetailedComponentModule,
        TranslateModule.forChild(),
        DomainsOffersUiHeroModule,
        SalesCommonModule,
        IdentificationModule,
        DeCareUseCasesPickAPlanStatePlanSelectionOrganicModule,
        IntersectionObserverModule,
        ReactiveComponentModule,
    ],
    providers: [LandingPageCanActivate, PlanSelectionOrganicNavigationService],
    declarations: [LandingPageComponent, FindYourAccountCardComponent],
})
export class DeCareUseCasesPickAPlanFeaturePlanSelectionOrganicModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
