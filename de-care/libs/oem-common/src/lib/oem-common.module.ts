import { CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguageResources, ModuleWithTranslation, PackageDescriptionTranslationsResolver } from '@de-care/app-common';
import { CustomerInfoModule } from '@de-care/customer-info';
import { DomainsOffersStateOffersInfoModule } from '@de-care/domains/offers/state-offers-info';
import { OffersModule } from '@de-care/offers';
import { SharedSxmUiUiLegalCopyModule } from '@de-care/shared/sxm-ui/ui-legal-copy';
import { SxmUiModule } from '@de-care/sxm-ui';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillingAddressStepComponent } from './page-parts/billing-address-step/billing-address-step.component';
import { ManageAccountComponent } from './pages/manage-account/manage-account.component';
import { OfferStepComponent } from './page-parts/offer-step/offer-step.component';
import { OemFlowComponent } from './pages/oem-flow/oem-flow.component';
import { OemStepperComponent } from './page-parts/oem-stepper/oem-stepper.component';
import { OemStepComponent } from './page-parts/oem-step/oem-step.component';
import { SubscriptionConfirmationStepComponent } from './page-parts/subscription-confirmation-step/subscription-confirmation-step.component';
import { SubscriptionErrorComponent } from './pages/subscription-error/subscription-error.component';
import { SummaryStepComponent } from './page-parts/summary-step/summary-step.component';
import { PaymentInfoStepComponent } from './page-parts/payment-info-step/payment-info-step.component';
import { OemFlowResolver } from './oem-flow.resolver';
import { SalesCommonModule } from '@de-care/sales-common';
import { ERROR_ROUTE_SEGMENT, MANAGE_ACCOUNT_SEGMENT } from '@de-care/de-oem/util-route';
import { ReviewOrderModule } from '@de-care/review-order';
import { SharedSxmUiUiNumericFormFieldModule } from '@de-care/shared/sxm-ui/ui-numeric-form-field';
import { DomainsQuotesStateQuoteModule } from '@de-care/domains/quotes/state-quote';

const routes: Routes = [
    { path: '', component: OemFlowComponent, resolve: { allPackageDescriptions: PackageDescriptionTranslationsResolver, oemFlowRouteData: OemFlowResolver } },
    { path: ERROR_ROUTE_SEGMENT, component: SubscriptionErrorComponent },
    { path: MANAGE_ACCOUNT_SEGMENT, component: ManageAccountComponent },
    { path: '**', redirectTo: ERROR_ROUTE_SEGMENT },
];

const DECLARATIONS = [
    BillingAddressStepComponent,
    ManageAccountComponent,
    OemFlowComponent,
    OemStepperComponent,
    OfferStepComponent,
    SubscriptionConfirmationStepComponent,
    SubscriptionErrorComponent,
    SummaryStepComponent,
    PaymentInfoStepComponent,
    OemStepComponent,
];

@NgModule({
    imports: [
        CdkStepperModule,
        CommonModule,
        CustomerInfoModule,
        OffersModule,
        RouterModule.forChild(routes),
        SxmUiModule,
        TranslateModule.forChild(),
        FormsModule,
        ReactiveFormsModule,
        DomainsQuotesUiOrderSummaryModule,
        SalesCommonModule,
        ReviewOrderModule,
        SharedSxmUiUiNumericFormFieldModule,
        SharedSxmUiUiLegalCopyModule,
        DomainsOffersStateOffersInfoModule,
        DomainsQuotesStateQuoteModule,
    ],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS],
    providers: [OemFlowResolver],
})
export class OemCommonModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': {
                ...require('./i18n/oem-common.en-CA.json'),
                ...require('libs/app-common/src/lib/i18n/app.en-CA.json'),
            },
            'en-US': {
                ...require('./i18n/oem-common.en-US.json'),
                ...require('libs/app-common/src/lib/i18n/app.en-US.json'),
            },
            'fr-CA': {
                ...require('./i18n/oem-common.fr-CA.json'),
                ...require('libs/app-common/src/lib/i18n/app.fr-CA.json'),
            },
        };
        super(translateService, languages);
    }
}
