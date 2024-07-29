import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '@de-care/shared/sxm-ui/ui-loading-with-alert-message';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SxmUiModule } from '@de-care/sxm-ui';
import { DomainsPurchaseUiTrialFollowOnFormFieldModule } from '@de-care/domains/purchase/ui-trial-follow-on-form-field';
import { DomainsPurchaseUiCreditCardFormFieldsModule } from '@de-care/domains/purchase/ui-credit-card-form-fields';
import { DomainsPurchaseUiServiceAddressSameAsBillingCheckboxModule } from '@de-care/domains/purchase/ui-service-address-same-as-billing-checkbox';
import { DomainsAccountUiNewAccountFormFieldsModule } from '@de-care/domains/account/ui-new-account-form-fields';
import { DomainsPaymentUiPrepaidRedeemModule } from '@de-care/domains/payment/ui-prepaid-redeem';
import { EnterYourInformationComponent } from './enter-your-information/enter-your-information.component';
import { IneligibleLoaderComponent } from './ineligible-loader/ineligible-loader.component';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { DomainsAccountUiRegisterModule } from '@de-care/domains/account/ui-register';
import { CustomerInfoModule } from '@de-care/customer-info';
import { SharedSxmUiUiNucaptchaModule } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { SharedSxmUiUiPostalCodeFormWrapperModule } from '@de-care/shared/sxm-ui/ui-postal-code-form-wrapper';
import { ForceUpdateFormFieldOnEnterKeyDirective } from '@de-care/shared/sxm-ui/ui-form-directives';

@NgModule({
    imports: [
        CommonModule,
        SharedSxmUiUiLoadingWithAlertMessageModule,
        TranslateModule.forChild(),
        SxmUiModule,
        FormsModule,
        ReactiveFormsModule,
        DomainsPurchaseUiTrialFollowOnFormFieldModule,
        DomainsPurchaseUiCreditCardFormFieldsModule,
        DomainsPurchaseUiServiceAddressSameAsBillingCheckboxModule,
        DomainsAccountUiNewAccountFormFieldsModule,
        DomainsPaymentUiPrepaidRedeemModule,
        SharedSxmUiUiAddressFormFieldsModule,
        DomainsAccountUiRegisterModule,
        CustomerInfoModule,
        SharedSxmUiUiNucaptchaModule,
        SharedSxmUiUiPostalCodeFormWrapperModule,
        ForceUpdateFormFieldOnEnterKeyDirective,
    ],
    declarations: [IneligibleLoaderComponent, EnterYourInformationComponent],
    exports: [IneligibleLoaderComponent, EnterYourInformationComponent],
})
export class DeCareUseCasesRollToDropUiSharedModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, settingService: SettingsService, userSettingsService: UserSettingsService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        if (settingService.isCanadaMode) {
            userSettingsService.setProvinceSelectionVisible(true);
        }

        super(translateService, languages);
    }
}
