import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { DeCareUseCasesSharedUiPageMainModule } from '@de-care/de-care-use-cases/shared/ui-page-main';
import { DeCareUseCasesTrialActivationRtpStateCreateAccountModule } from '@de-care/de-care-use-cases/trial-activation/rtp/state-create-account';
import { DomainsCustomerUiVerifyAddressModule } from '@de-care/domains/customer/ui-verify-address';
import { CanActivateLoadEnvironmentInfo, DomainsUtilityStateEnvironmentInfoModule } from '@de-care/domains/utility/state-environment-info';
import { DomainsVehicleUiVehicleInfoModule } from '@de-care/domains/vehicle/ui-vehicle-info';
import { SharedStateSettingsModule } from '@de-care/settings';
import { SharedAsyncValidatorsStateEmailVerificationModule } from '@de-care/shared/async-validators/state-email-verification';
import { SharedSxmUiUiCheckboxWithLabelFormFieldModule } from '@de-care/shared/sxm-ui/ui-checkbox-with-label-form-field';
import { SharedSxmUiUiDropdownFormFieldModule } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';
import { SharedSxmUiUiEmailFormFieldModule } from '@de-care/shared/sxm-ui/ui-email-form-field';
import { SharedSxmUiUiFormFieldMasksModule } from '@de-care/shared/sxm-ui/ui-form-field-masks';
import { SharedSxmUiUiNumericFormFieldModule } from '@de-care/shared/sxm-ui/ui-numeric-form-field';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { SharedSxmUiUiTranslationSplitterModule } from '@de-care/shared/sxm-ui/ui-translation-splitter';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { SxmUiModule } from '@de-care/sxm-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CanActivateAccountActivationService } from './account-activation.guard';
import { CreateAccountComponent } from './create-account/create-account.component';
import { SharedSxmUiUiChooseGenreFormModule } from '@de-care/shared/sxm-ui/ui-choose-genre-form';
import { SharedSxmUiUiPlanComparisonGridModule } from '@de-care/shared/sxm-ui/ui-plan-comparison-grid';
import { SharedSxmUiUiFollowOnSelectionModule } from '@de-care/shared/sxm-ui/ui-follow-on-selection';
import { SharedSxmUiUiPlanSelectionModule } from '@de-care/shared/sxm-ui/ui-plan-selection';
import { SharedSxmUiUiLegalCopyModule } from '@de-care/shared/sxm-ui/ui-legal-copy';
import { SharedSxmUiUiInputFocusModule } from '@de-care/shared/sxm-ui/ui-input-focus';
import { DomainsPaymentUiPrepaidRedeemModule } from '@de-care/domains/payment/ui-prepaid-redeem';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                component: CreateAccountComponent,
                canActivate: [CanActivateLoadEnvironmentInfo, CanActivateAccountActivationService],
            },
        ]),
        TranslateModule.forChild(),
        ReactiveFormsModule,
        DomainsUtilityStateEnvironmentInfoModule,
        DeCareUseCasesTrialActivationRtpStateCreateAccountModule,
        TranslateModule,
        SharedSxmUiUiEmailFormFieldModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedSxmUiUiTranslationSplitterModule,
        SharedSxmUiUiDropdownFormFieldModule,
        SharedSxmUiUiTextFormFieldModule,
        SharedSxmUiUiCheckboxWithLabelFormFieldModule,
        SharedSxmUiUiNumericFormFieldModule,
        SxmUiModule,
        DomainsVehicleUiVehicleInfoModule,
        SharedStateSettingsModule,
        DomainsCustomerUiVerifyAddressModule,
        SharedValidationFormControlInvalidModule,
        SharedAsyncValidatorsStateEmailVerificationModule,
        DeCareUseCasesSharedUiPageMainModule,
        SharedSxmUiUiFormFieldMasksModule,
        SharedSxmUiUiChooseGenreFormModule,
        SharedSxmUiUiPlanComparisonGridModule,
        SharedSxmUiUiFollowOnSelectionModule,
        SharedSxmUiUiPlanSelectionModule,
        SharedSxmUiUiLegalCopyModule,
        SharedSxmUiUiInputFocusModule,
        DomainsPaymentUiPrepaidRedeemModule,
    ],
    declarations: [CreateAccountComponent],
})
export class DeCareUseCasesTrialActivationRtpFeatureCreateAccountModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
