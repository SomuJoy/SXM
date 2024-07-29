import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeCareUseCasesAccountStateMyAccountAccountInfoModule } from '@de-care/de-care-use-cases/account/state-my-account-account-info';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiToastNotificationModule } from '@de-care/shared/sxm-ui/ui-toast-notification';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiBillingEbillOptOutComponentModule, SharedSxmUiBillingEbillUpdateEmailComponentModule } from '@de-care/shared/sxm-ui/billing/ui-billing';
import { ContactPreferencesPageComponent } from './pages/contact-preferences-page/contact-preferences-page.component';
import { ContactPreferencesCanActivateService } from './pages/contact-preferences-page/contact-preferences-can-activate';
import { SxmUiSkeletonLoaderPanelComponentModule } from '@de-care/shared/sxm-ui/ui-skeleton-loader-panel';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                children: [
                    {
                        path: 'account-information',
                        loadComponent: () => import('./pages/account-information-page/account-information-page.component').then((m) => m.AccountInformationPageComponent),
                        children: [
                            {
                                path: 'updateEmail',
                                loadComponent: () => import('@de-care/de-care-use-cases/account/ui-common').then((m) => m.UpdateEbillEmailComponent),
                                outlet: 'modal',
                            },
                            {
                                path: 'optOut',
                                loadComponent: () => import('@de-care/de-care-use-cases/account/ui-common').then((m) => m.EbillOptOutComponent),
                                outlet: 'modal',
                            },
                        ],
                    },
                    {
                        path: 'account-information/edit-contact-info',
                        loadComponent: () => import('./pages/edit-contact-info-page/edit-contact-info-page.component').then((m) => m.EditContactInfoPageComponent),
                    },
                    {
                        path: 'account-information/edit-account-login',
                        loadComponent: () => import('./pages/edit-account-login-page/edit-account-login-page.component').then((m) => m.EditAccountLoginPageComponent),
                    },
                    {
                        path: 'account-information/edit-streaming-login',
                        loadComponent: () => import('./pages/edit-streaming-login-page/edit-streaming-login-page.component').then((m) => m.EditStreamingLoginPageComponent),
                    },
                    {
                        path: 'account-information/edit-billing-address',
                        loadComponent: () => import('./pages/edit-billing-address-page/edit-billing-address-page.component').then((m) => m.EditBillingAddressPageComponent),
                    },
                    {
                        path: 'contact-preferences',
                        component: ContactPreferencesPageComponent,
                        canActivate: [ContactPreferencesCanActivateService],
                    },
                    { path: '', pathMatch: 'full', redirectTo: 'account-information' },
                ],
            },
        ]),
        TranslateModule.forChild(),
        DeCareUseCasesAccountStateMyAccountAccountInfoModule,
        SharedSxmUiUiToastNotificationModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiBillingEbillUpdateEmailComponentModule,
        SharedSxmUiBillingEbillOptOutComponentModule,
        SxmUiSkeletonLoaderPanelComponentModule,
    ],
    declarations: [ContactPreferencesPageComponent],
})
export class DeCareUseCasesAccountFeatureMyAccountAccountInfoModule {}
