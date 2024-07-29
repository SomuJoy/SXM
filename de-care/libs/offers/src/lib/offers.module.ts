import { DomainsOffersUiOfferCardFormFieldModule } from '@de-care/domains/offers/ui-offer-card-form-field';
import { DomainsOffersUiGroupedOfferCardFormFieldModule } from '@de-care/domains/offers/ui-grouped-offer-card-form-field';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation, PackageDescriptionTranslationsService } from '@de-care/app-common';
import { SxmUiModule } from '@de-care/sxm-ui';
import { SalesCommonModule } from '@de-care/sales-common';
import { DifferentPlatformComponent } from './different-platform/different-platform.component';
import { LeadOfferDetailsComponent } from './lead-offer-details/lead-offer-details.component';
import { LeadOfferDetailsOemComponent } from './lead-offer-details/lead-offer-details-oem/lead-offer-details-oem.component';
import { BetterPricingComponent } from './better-pricing/better-pricing.component';
import { MoreContentUpsellComponent } from './more-content-upsell/more-content-upsell.component';
import { PlatformUpgradeOptionComponent } from './platform-upgrade-option/platform-upgrade-option.component';
import { ImportantInfoComponent } from './important-info/important-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FollowOnSelectionComponent } from './page-parts/follow-on-selection/follow-on-selection.component';
import { PlanComparisonGridComponent } from './plan-comparison-grid/plan-comparison-grid.component';
import { OfferNotAvailableConfirmationComponent } from './offer-not-available-confirmation/offer-not-available-confirmation.component';
import { MultiPackageSelectionFormComponent } from './multi-package-selection-form/multi-package-selection-form.component';
import { DomainsOffersUiHeroModule } from '@de-care/domains/offers/ui-hero';
import { MultiPackageIsBestPackage } from './multi-package-selection-form/multi-package-is-best-package.pipe';
import { MultiPackagePackageDescriptionForOfferCard } from './multi-package-selection-form/multi-package-package-description-for-offer-card.pipe';
import { PlanComparisonGridTooltipLinkIdPipe } from './plan-comparison-grid-tooltip-link-id.pipe';
import { FallbackOfferIsMwbMcpPipe } from './offer-not-available-confirmation/fallback-offer-is-mwb-mcp.pipe';
import { DomainsOffersUiPlanDescriptionChannelsModule } from '@de-care/domains/offers/ui-plan-description-channels';
import { DomainsOffersUiPlanGridModule } from '@de-care/domains/offers/ui-plan-grid';
import { DomainsOffersUiOfferDescriptionModule } from '@de-care/domains/offers/ui-offer-description';
import { DomainsOffersUiPackageDescriptionsModule, TranslateOfferPromoFooterPipe } from '@de-care/domains/offers/ui-package-descriptions';
import { DomainsOffersUiOfferCardModule } from '@de-care/domains/offers/ui-offer-card';
import { DomainsOffersUiOfferCardWithPartialChannelsVisibleModule } from '@de-care/domains/offers/ui-offer-card-with-partial-channels-visible';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';

const DECLARATIONS = [
    DifferentPlatformComponent,
    LeadOfferDetailsComponent,
    LeadOfferDetailsOemComponent,
    BetterPricingComponent,
    MoreContentUpsellComponent,
    PlatformUpgradeOptionComponent,
    ImportantInfoComponent,
    FollowOnSelectionComponent,
    PlanComparisonGridComponent,
    OfferNotAvailableConfirmationComponent,
    MultiPackageSelectionFormComponent,
    PlanComparisonGridTooltipLinkIdPipe,
    FallbackOfferIsMwbMcpPipe,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SxmUiModule,
        SalesCommonModule,
        DomainsOffersUiHeroModule,
        DomainsOffersUiGroupedOfferCardFormFieldModule,
        DomainsOffersUiPlanDescriptionChannelsModule,
        DomainsOffersUiPlanGridModule,
        DomainsOffersUiOfferDescriptionModule,
        DomainsOffersUiPackageDescriptionsModule,
        DomainsOffersUiOfferCardModule,
        DomainsOffersUiOfferCardFormFieldModule,
        DomainsOffersUiOfferCardWithPartialChannelsVisibleModule,
        DomainsChatUiChatWithAgentLinkModule,
        SharedSxmUiUiPrimaryPackageCardModule,
    ],
    declarations: [...DECLARATIONS, MultiPackageIsBestPackage, MultiPackagePackageDescriptionForOfferCard],
    exports: [
        ...DECLARATIONS,
        DomainsOffersUiHeroModule,
        DomainsOffersUiGroupedOfferCardFormFieldModule,
        DomainsOffersUiPlanDescriptionChannelsModule,
        DomainsOffersUiPlanGridModule,
        DomainsOffersUiOfferDescriptionModule,
        DomainsOffersUiOfferCardModule,
        DomainsOffersUiPackageDescriptionsModule,
    ],
    providers: [TranslateOfferPromoFooterPipe],
})
export class OffersModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/offers.en-CA.json'),
            'en-US': require('./i18n/offers.en-US.json'),
            'fr-CA': require('./i18n/offers.fr-CA.json'),
        };
        super(translateService, languages);
        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
