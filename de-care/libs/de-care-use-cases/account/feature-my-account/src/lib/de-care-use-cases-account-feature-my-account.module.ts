import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { DeCareUseCasesAccountStateMyAccountModule } from '@de-care/de-care-use-cases/account/state-my-account';
import { ShellComponent } from './shell/shell.component';
import { LoadAccountCanActivateService } from './load-account-can-activate.service';
import {
    DisableRoutingLoaderCanActivateService,
    LoadPackageDescriptionsCanActivateService,
    UpdateUsecaseCanActivateService,
    TurnOnFullPageLoaderCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { CheckPageReadyCanActivateService } from './check-page-ready-can-activate.service';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { DeCareSharedUiPageFooterBasicModule } from '@de-care/de-care/shared/ui-page-footer-basic';
import {
    SharedSxmUiAlertsPanelLoggedInModule,
    SharedSxmUiMobileAppCtaModule,
    SxmUiAccountPresenceIconModule,
    SxmUiAlertsIconModule,
    SxmUiMyAccountPanelLoggedInComponentModule,
    SxmUiNavDropdownModule,
} from '@de-care/shared/sxm-ui/navigation/ui-navigation';
import { CheckAccessFeatureFlagCanActivateService } from './check-access-feature-flag-can-activate.service';
import { SharedSxmUiUiToastNotificationModule } from '@de-care/shared/sxm-ui/ui-toast-notification';
import { SxmUiHoverDropdownComponentModule } from '@de-care/shared/sxm-ui/utility/ui-hover-dropdown';
import { SxmUiPriceChangeMessageWithIconComponentModule } from '@de-care/shared/sxm-ui/account/ui-account-event';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        RouterModule.forChild([
            {
                path: '',
                data: { useCaseKey: 'ACCOUNT_DASHBOARD' },
                canActivate: [
                    TempIncludeGlobalStyleScriptCanActivateService,
                    TurnOnFullPageLoaderCanActivateService,
                    CheckAccessFeatureFlagCanActivateService,
                    UpdateUsecaseCanActivateService,
                ],
                children: [
                    {
                        path: '',
                        component: ShellComponent,
                        canActivate: [LoadPackageDescriptionsCanActivateService, LoadAccountCanActivateService, DisableRoutingLoaderCanActivateService],
                        children: [
                            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
                            {
                                path: 'dashboard',
                                loadChildren: () =>
                                    import('@de-care/de-care-use-cases/account/feature-my-account-dashboard').then(
                                        (m) => m.DeCareUseCasesAccountFeatureMyAccountDashboardModule
                                    ),
                                canActivate: [CheckPageReadyCanActivateService],
                            },
                            {
                                path: 'subscriptions',
                                loadChildren: () =>
                                    import('@de-care/de-care-use-cases/account/feature-my-account-subscriptions').then(
                                        (m) => m.DeCareUseCasesAccountFeatureMyAccountSubscriptionsModule
                                    ),
                            },
                            {
                                path: 'billing',
                                loadChildren: () =>
                                    import('@de-care/de-care-use-cases/account/feature-my-account-billing').then((m) => m.DeCareUseCasesAccountFeatureMyAccountBillingModule),
                            },
                            {
                                path: 'account-info',
                                loadChildren: () =>
                                    import('@de-care/de-care-use-cases/account/feature-my-account-account-info').then(
                                        (m) => m.DeCareUseCasesAccountFeatureMyAccountAccountInfoModule
                                    ),
                            },
                        ],
                    },
                ],
            },
        ]),
        ReactiveComponentModule,
        DeCareUseCasesAccountStateMyAccountModule,
        SharedSxmUiUiDataClickTrackModule,
        DeCareSharedUiPageFooterBasicModule,
        SxmUiAccountPresenceIconModule,
        SxmUiNavDropdownModule,
        SharedSxmUiMobileAppCtaModule,
        SharedSxmUiAlertsPanelLoggedInModule,
        SxmUiAlertsIconModule,
        SxmUiMyAccountPanelLoggedInComponentModule,
        SharedSxmUiUiToastNotificationModule,
        SxmUiHoverDropdownComponentModule,
        SxmUiPriceChangeMessageWithIconComponentModule,
    ],
    declarations: [ShellComponent],
})
export class DeCareUseCasesAccountFeatureMyAccountModule {}
