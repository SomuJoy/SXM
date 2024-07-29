import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeCareUseCasesCheckoutStateZeroCostModule } from '@de-care/de-care-use-cases/checkout/state-zero-cost';
import { StepDeviceLookupPageComponent } from './pages/step-device-lookup-page/step-device-lookup-page.component';
import { StepAccountInfoPageComponent } from './pages/step-account-info-page/step-account-info-page.component';
import { StepDeviceActivationPageComponent } from './pages/step-device-activation-page/step-device-activation-page.component';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { TranslateModule } from '@ngx-translate/core';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import {
    LoadEnvironmentInfoCanActivateService,
    LoadIpLocationAndSetProvinceCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
    TurnOffFullPageLoaderCanActivateService,
    UpdateUsecaseCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { AccountInfoFormComponentModule, ErrorPagesModule, PromoCodeRedeemedErrorPageComponent } from '@de-care/de-care-use-cases/checkout/ui-common';
import { ReactiveComponentModule } from '@ngrx/component';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { StepDeviceLookupCanActivateService } from './pages/step-device-lookup-page/step-device-lookup-can-activate.service';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { SharedSxmUiUiTextInputWithTooltipFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-input-with-tooltip-form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiFormsUiFirstNameFormFieldModule } from '@de-care/shared/sxm-ui/forms/ui-first-name-form-field';
import { SharedSxmUiUiLastNameFormFieldModule } from '@de-care/shared/sxm-ui/ui-last-name-form-field';
import { SharedSxmUiUiEmailFormFieldModule } from '@de-care/shared/sxm-ui/ui-email-form-field';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { DomainsDeviceUiRefreshDeviceModule } from '@de-care/domains/device/ui-refresh-device';
import { DeviceTransactionStateCanActivateService } from './device-transaction-state-can-activate.service';
import { VehicleInfoOrRadioPipe } from './vehicle-info-or-radio.pipe';
import { SharedSxmUiUiHelpFindingRadioModule } from '@de-care/shared/sxm-ui/ui-help-finding-radio';
import { DomainsAccountUiRegisterModule } from '@de-care/domains/account/ui-register';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { SharedSxmUiUiDatePipeModule } from '@de-care/shared/sxm-ui/ui-pipes';
import { SharedSxmUiUiHeroModule } from '@de-care/shared/sxm-ui/ui-hero';
import { SxmUiReadyToExploreComponentModule } from '@de-care/shared/sxm-ui/navigation/ui-common-cta-navigation';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, LoadEnvironmentInfoCanActivateService],
                children: [
                    {
                        path: 'promo-code-redeemed-error',
                        pathMatch: 'full',
                        component: PageShellBasicComponent,
                        data: { pageShellBasic: { headerTheme: 'gray' } as PageShellBasicRouteConfiguration },
                        canActivate: [TurnOffFullPageLoaderCanActivateService],
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                component: PromoCodeRedeemedErrorPageComponent,
                            },
                        ],
                    },
                    {
                        path: 'satellite',
                        component: PageShellBasicComponent,
                        data: { useCaseKey: 'SATELLITE_ORGANIC_NOCOST', pageShellBasic: { allowProvinceBar: true, headerTheme: 'black' } as PageShellBasicRouteConfiguration },
                        canActivate: [TurnOffFullPageLoaderCanActivateService, UpdateUsecaseCanActivateService],
                        children: [
                            { path: '', redirectTo: './device-lookup', pathMatch: 'full' },
                            {
                                path: 'device-lookup',
                                pathMatch: 'full',
                                component: StepDeviceLookupPageComponent,
                                canActivate: [LoadIpLocationAndSetProvinceCanActivateService, StepDeviceLookupCanActivateService],
                            },
                            {
                                path: 'account-info',
                                pathMatch: 'full',
                                component: StepAccountInfoPageComponent,
                                canActivate: [DeviceTransactionStateCanActivateService],
                            },
                            {
                                path: 'device-activation',
                                pathMatch: 'full',
                                component: StepDeviceActivationPageComponent,
                                canActivate: [DeviceTransactionStateCanActivateService],
                            },
                        ],
                    },
                ],
            },
        ]),
        TranslateModule.forChild(),
        ReactiveComponentModule,
        ReactiveFormsModule,
        DeCareUseCasesCheckoutStateZeroCostModule,
        DeCareSharedUiPageShellBasicModule,
        DeCareSharedUiPageLayoutModule,
        ErrorPagesModule,
        SharedSxmUiUiHeroModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SharedSxmUiUiTextInputWithTooltipFormFieldModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiFormsUiFirstNameFormFieldModule,
        SharedSxmUiUiLastNameFormFieldModule,
        SharedSxmUiUiEmailFormFieldModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedSxmUiUiAddressFormFieldsModule,
        SharedSxmUiUiPrivacyPolicyModule,
        AccountInfoFormComponentModule,
        DomainsDeviceUiRefreshDeviceModule,
        SharedSxmUiUiHelpFindingRadioModule,
        DomainsAccountUiRegisterModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        SharedSxmUiUiDatePipeModule,
        SxmUiReadyToExploreComponentModule,
    ],
    declarations: [StepDeviceLookupPageComponent, StepAccountInfoPageComponent, StepDeviceActivationPageComponent, VehicleInfoOrRadioPipe],
})
export class DeCareUseCasesCheckoutFeatureZeroCostModule {}
