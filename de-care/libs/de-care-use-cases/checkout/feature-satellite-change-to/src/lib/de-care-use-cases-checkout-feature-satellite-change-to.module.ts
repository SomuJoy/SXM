import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeCareUseCasesCheckoutStateSatelliteChangeToModule } from '@de-care/de-care-use-cases/checkout/state-satellite-change-to';
import { LoadSatelliteChangeToDataCanActivateService } from './routes/load-satellite-change-to-data-can-activate.service';
import {
    DeCareSharedUiPageShellBasicModule,
    PageProcessingMessageComponent,
    PageShellBasicComponent,
    PageShellBasicRouteConfiguration,
} from '@de-care/de-care/shared/ui-page-shell-basic';
import { HidePageLoaderCanActivateService } from '@de-care/de-care-use-cases/checkout/ui-common';
import { TempIncludeGlobalStyleScriptCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page.component';
import { ConfirmationCanActivateService } from './pages/confirmation-page/confirmation-can-activate.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                canActivate: [LoadSatelliteChangeToDataCanActivateService],
                component: PageProcessingMessageComponent,
            },
            {
                path: '',
                component: PageShellBasicComponent,
                canActivate: [
                    TempIncludeGlobalStyleScriptCanActivateService,
                    HidePageLoaderCanActivateService,
                    // TODO: Add a new CanActivate that will ask feature state to tell it if transaction state exists
                    //       (we only want to allow this route and children to work if we have the appropriate feature state data)
                ],
                children: [
                    {
                        path: 'device-select',
                        pathMatch: 'full',
                        data: {
                            pageStepConfiguration: {
                                totalNumberOfSteps: 3,
                                currentStepNumber: 1,
                                routeUrlNext: '../payment-page',
                                lookupDeviceUrl: '../device-lookup',
                            },
                        },
                        loadComponent: () => import('./pages/select-your-radio-page/select-your-radio-page.component').then((c) => c.SelectYourRadioPageComponent),
                    },
                    {
                        path: 'device-lookup',
                        pathMatch: 'full',
                        data: {
                            pageStepConfiguration: {
                                totalNumberOfSteps: 3,
                                currentStepNumber: 1,
                                routeUrlNext: '../payment-page',
                            },
                        },
                        loadComponent: () => import('./pages/lookup-radio-page/lookup-radio-page.component').then((c) => c.LookupRadioPageComponent),
                    },
                    {
                        path: 'payment-page',
                        pathMatch: 'full',
                        data: {
                            pageStepConfiguration: {
                                totalNumberOfSteps: 3,
                                currentStepNumber: 2,
                                routeUrlNext: '../review-page',
                                startOfFlowUrl: '../device-select',
                                lookupDeviceUrl: '../device-lookup',
                            },
                        },
                        loadComponent: () => import('./pages/payment-page/payment-page.component').then((c) => c.PaymentPageComponent),
                    },
                    {
                        path: 'review-page',
                        pathMatch: 'full',
                        data: {
                            pageStepConfiguration: {
                                totalNumberOfSteps: 3,
                                currentStepNumber: 3,
                                routeUrlNext: '../../thanks',
                                startOfFlowUrl: '../device-select',
                                lookupDeviceUrl: '../device-lookup',
                            },
                        },
                        loadComponent: () => import('./pages/review-page/review-page.component').then((c) => c.ReviewPageComponent),
                    },
                ],
            },
            {
                path: 'thanks',
                pathMatch: 'full',
                component: PageShellBasicComponent,
                data: { pageShellBasic: { headerTheme: 'blue' } as PageShellBasicRouteConfiguration },
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        loadComponent: () => import('./pages/confirmation-page/confirmation-page.component').then((c) => c.ConfirmationPageComponent),
                        canActivate: [ConfirmationCanActivateService],
                    },
                ],
            },
        ]),
        DeCareUseCasesCheckoutStateSatelliteChangeToModule,
        DeCareSharedUiPageShellBasicModule,
    ],
    declarations: [],
})
export class DeCareUseCasesCheckoutFeatureSatelliteChangeToModule {}
