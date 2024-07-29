import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { CustomerInfoModule } from '@de-care/customer-info';
import { DeCareUseCasesCheckoutStateCheckoutTriageModule } from '@de-care/de-care-use-cases/checkout/state-checkout-triage';
import { DomainsOffersStateFollowOnOffersModule } from '@de-care/domains/offers/state-follow-on-offers';
import { DomainsOffersUiPriceIncreaseMessageModule } from '@de-care/domains/offers/ui-price-increase-message';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { IdentificationModule } from '@de-care/identification';
import { OfferUpsellModule } from '@de-care/offer-upsell';
import { OffersModule } from '@de-care/offers';
import { PurchaseStateModule } from '@de-care/purchase-state';
import { ReviewOrderModule } from '@de-care/review-order';
import { SalesCommonModule } from '@de-care/sales-common';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiRadioOptionWithTooltipFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-with-tooltip-form-field';
import { SharedSxmUiUiLegalCopyModule } from '@de-care/shared/sxm-ui/ui-legal-copy';
import { SxmUiModule } from '@de-care/sxm-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FeatureToggleModule } from 'ngx-feature-toggle';
import { FlepzComponent } from './components/flepz/flepz.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { ReviewOrderComponent } from './components/review-order/review-order.component';
import { ReviewSubscriptionOptionsComponent } from './components/review-subscription-options/review-subscription-options.component';
import { AccountCredentialsAndLookupStepComponent } from './page-parts/account-credentials-and-lookup-step/account-credentials-and-lookup-step.component';
import { AccountLookupStepComponent } from './page-parts/account-lookup-step/account-lookup-step.component';
import { StreamingOrganicPurchaseStepsComponent } from './page-parts/streaming-organic-purchase-steps/streaming-organic-purchase-steps.component';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '@de-care/shared/sxm-ui/ui-loading-with-alert-message';
import { SharedSxmUiUiNucaptchaModule } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { SharedSxmUiUiChooseGenreFormModule } from '@de-care/shared/sxm-ui/ui-choose-genre-form';
import { DeCareUseCasesCheckoutUiCommonModule } from '@de-care/de-care-use-cases/checkout/ui-common';
import { ForceUpdateFormFieldOnEnterKeyDirective } from '@de-care/shared/sxm-ui/ui-form-directives';

@NgModule({
    declarations: [
        AccountLookupStepComponent,
        PurchaseComponent,
        ReviewOrderComponent,
        FlepzComponent,
        ReviewSubscriptionOptionsComponent,
        StreamingOrganicPurchaseStepsComponent,
        AccountCredentialsAndLookupStepComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forChild(),
        FeatureToggleModule,
        SxmUiModule,
        PurchaseStateModule,
        SalesCommonModule,
        OffersModule,
        OfferUpsellModule,
        ReviewOrderModule,
        DomainsQuotesUiOrderSummaryModule,
        CustomerInfoModule,
        IdentificationModule,
        DomainsOffersStateFollowOnOffersModule,
        DeCareUseCasesCheckoutStateCheckoutTriageModule,
        DomainsOffersUiPriceIncreaseMessageModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiRadioOptionWithTooltipFormFieldModule,
        SharedSxmUiUiLegalCopyModule,
        DeCareUseCasesCheckoutUiCommonModule,
        SharedSxmUiUiLoadingWithAlertMessageModule,
        SharedSxmUiUiNucaptchaModule,
        SharedSxmUiUiChooseGenreFormModule,
        ForceUpdateFormFieldOnEnterKeyDirective,
    ],
    exports: [PurchaseComponent, StreamingOrganicPurchaseStepsComponent],
})
export class PurchaseModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/purchase.en-CA.json'),
            'en-US': require('./i18n/purchase.en-US.json'),
            'fr-CA': require('./i18n/purchase.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
