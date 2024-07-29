import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiPackageSatelliteUpgradeCardFormFieldModule } from '@de-care/shared/sxm-ui/ui-package-satellite-upgrade-card-form-field';
import { SharedSxmUiUiPackageStreamingUpgradeCardFormFieldModule } from '@de-care/shared/sxm-ui/ui-package-streaming-upgrade-card-form-field';
import { SharedSxmUiUiPackageTermUpgradeCardFormFieldModule } from '@de-care/shared/sxm-ui/ui-package-term-upgrade-card-form-field';
import { SatelliteUpsellsFormComponent } from './satellite-upsells-form/satellite-upsells-form.component';
import { StreamingUpsellsFormComponent } from './streaming-upsells-form/streaming-upsells-form.component';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { SharedSxmUiUiUsernameFormFieldModule } from '@de-care/shared/sxm-ui/ui-username-form-field';
import { SharedSxmUiUiCreditCardFormFieldsModule } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { DomainsPaymentUiPrepaidRedeemModule } from '@de-care/domains/payment/ui-prepaid-redeem';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { DomainsCustomerUiVerifyAddressModule } from '@de-care/domains/customer/ui-verify-address';
import { PaymentInfoFormComponent } from './payment-info-form/payment-info-form.component';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { ReviewQuoteAndApproveFormComponent } from './review-quote-and-approve-form/review-quote-and-approve-form.component';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { SharedSxmUiUiNucaptchaModule } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { AccountInfoAndPaymentInfoFormComponent } from './account-info-and-payment-info-form/account-info-and-payment-info-form.component';
import { UsernameAndPasswordFormComponent } from './username-and-password-form/username-and-password-form.component';
import { SharedSxmUiFormsUiFirstNameFormFieldModule } from '@de-care/shared/sxm-ui/forms/ui-first-name-form-field';
import { SxmUiLastNameFormFieldComponent } from './last-name-form-field/last-name-form-field.component';
import { PhoneNumberFormFieldComponent } from './phone-number-form-field/phone-number-form-field.component';
import { SharedSxmUiUiFormFieldMasksModule } from '@de-care/shared/sxm-ui/ui-form-field-masks';
import { VehicleInfoTranslatePipe } from './pipes/vehicle-info-translate.pipe';
import { SxmDatePipe } from './pipes/sxm-date.pipe';
import { SxmCurrencyPipe } from './pipes/smx-currency.pipe';
import { SubscriptionSummaryComponent } from './subscription-summary/subscription-summary.component';
import { AccountInfoBasicAndPaymentInfoFormComponent } from './account-info-basic-and-payment-info-form/account-info-basic-and-payment-info-form.component';
import { SharedSxmUiUiPostalCodeFormFieldModule } from '@de-care/shared/sxm-ui/ui-postal-code-form-field';
import { PaymentInfoBasicFormComponent } from './payment-info-basic-form/payment-info-basic-form.component';
import { PaymentInfoBasicWithQuotesComponent } from './payment-info-basic-with-quotes-form/payment-info-basic-with-quotes-form.component';
import { AccountInfoAndPaymentInfoWithQuotesFormComponent } from './account-info-and-payment-info-with-quotes-form/account-info-and-payment-info-with-quotes-form.component';
import { AccountInfoBasicAndPaymentInfoWithQuotesFormComponent } from './account-info-basic-and-payment-info-with-quotes-form/account-info-basic-and-payment-info-with-quotes-form.component';
import { QuotesWithLoadingAnimationComponent } from './quotes-with-loading-animation/quotes-with-loading-animation.component';
import { SxmUiQuoteSkeletonComponentModule } from '@de-care/shared/sxm-ui/quotes/ui-quote-skeletons';
import { ForceUpdateFormFieldOnEnterKeyDirective } from '@de-care/shared/sxm-ui/ui-form-directives';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiPackageSatelliteUpgradeCardFormFieldModule,
        SharedSxmUiUiPackageStreamingUpgradeCardFormFieldModule,
        SharedSxmUiUiPackageTermUpgradeCardFormFieldModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiRadioOptionFormFieldModule,
        SharedSxmUiUiPostalCodeFormFieldModule,
        SharedSxmUiFormsUiFirstNameFormFieldModule,
        SharedSxmUiUiCreditCardFormFieldsModule,
        SharedSxmUiUiAddressFormFieldsModule,
        SharedSxmUiUiPasswordFormFieldModule,
        SharedSxmUiUiUsernameFormFieldModule,
        DomainsPaymentUiPrepaidRedeemModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiDataClickTrackModule,
        DomainsCustomerUiVerifyAddressModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiFormFieldMasksModule,
        // TODO: need to look in to updating this module so it doesn't depend on the old SxmUi module
        DomainsQuotesUiOrderSummaryModule,

        // TODO: need to refactor this module since it is including a dependency on a domain state lib
        SharedSxmUiUiNucaptchaModule,
        SxmUiQuoteSkeletonComponentModule,
        ForceUpdateFormFieldOnEnterKeyDirective,
        PaymentInfoFormComponent,
        ReviewQuoteAndApproveFormComponent,
    ],
    declarations: [
        SubscriptionSummaryComponent,
        SatelliteUpsellsFormComponent,
        StreamingUpsellsFormComponent,
        AccountInfoAndPaymentInfoFormComponent,
        UsernameAndPasswordFormComponent,
        AccountInfoBasicAndPaymentInfoFormComponent,
        SxmUiLastNameFormFieldComponent,
        PhoneNumberFormFieldComponent,
        VehicleInfoTranslatePipe,
        SxmDatePipe,
        SxmCurrencyPipe,
        PaymentInfoBasicFormComponent,
        PaymentInfoBasicWithQuotesComponent,
        AccountInfoAndPaymentInfoWithQuotesFormComponent,
        AccountInfoBasicAndPaymentInfoWithQuotesFormComponent,
        QuotesWithLoadingAnimationComponent,
    ],
    exports: [
        SubscriptionSummaryComponent,
        SatelliteUpsellsFormComponent,
        StreamingUpsellsFormComponent,
        AccountInfoAndPaymentInfoFormComponent,
        UsernameAndPasswordFormComponent,
        AccountInfoBasicAndPaymentInfoFormComponent,
        PaymentInfoFormComponent,
        ReviewQuoteAndApproveFormComponent,
        VehicleInfoTranslatePipe,
        SxmDatePipe,
        SxmCurrencyPipe,
        PaymentInfoBasicFormComponent,
        PaymentInfoBasicWithQuotesComponent,
        AccountInfoAndPaymentInfoWithQuotesFormComponent,
        AccountInfoBasicAndPaymentInfoWithQuotesFormComponent,
    ],
})
export class DeCareUseCasesCheckoutUiCommonModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
