import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeCareUseCasesCheckoutStateAddRadioRouterModule } from '@de-care/de-care-use-cases/checkout/state-add-radio-router';
import {
    DeCareSharedUiPageShellBasicModule,
    PageProcessingMessageComponent,
    PageShellBasicComponent,
    PageShellBasicRouteConfiguration,
} from '@de-care/de-care/shared/ui-page-shell-basic';
import { HidePageLoaderCanActivateService } from '@de-care/de-care-use-cases/checkout/ui-common';
import { TempIncludeGlobalStyleScriptCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { ConfirmationCanActivateService } from './pages/confirmation-page/confirmation-can-activate.service';
import { FindSubscriptionAddRadioRouterCanActivateService } from './routes/find-subscription-add-radio-router-can-activate.service';
import { ActivateRadioAddRadioRouterCanActivateService } from './routes/activate-radio-add-radio-router-can-activate.service';
import { MessagesPageComponent } from './pages/messages-page/messages-page.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'activate-radio-init',
                pathMatch: 'full',
                canActivate: [ActivateRadioAddRadioRouterCanActivateService],
                component: PageProcessingMessageComponent,
            },
            {
                path: 'find-subscription-init',
                pathMatch: 'full',
                canActivate: [FindSubscriptionAddRadioRouterCanActivateService],
                component: PageProcessingMessageComponent,
            },
            {
                path: '',
                pathMatch: 'full',
                component: MessagesPageComponent,
            },
            {
                path: '',
                component: PageShellBasicComponent,
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, HidePageLoaderCanActivateService],
                children: [
                    {
                        path: 'device-select',
                        pathMatch: 'full',
                        data: {
                            pageStepConfiguration: {
                                totalNumberOfSteps: 4,
                                currentStepNumber: 1,
                                routeUrlNext: '../pick-a-plan',
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
                                totalNumberOfSteps: 4,
                                currentStepNumber: 1,
                                routeUrlNext: '../pick-a-plan',
                            },
                        },
                        loadComponent: () => import('./pages/lookup-radio-page/lookup-radio-page.component').then((c) => c.LookupRadioPageComponent),
                    },
                    {
                        path: 'pick-a-plan',
                        pathMatch: 'full',
                        data: {
                            pageStepConfiguration: {
                                totalNumberOfSteps: 4,
                                currentStepNumber: 2,
                                routeUrlNext: '../payment-int',
                            },
                        },
                        loadComponent: () => import('./pages/pick-a-plan-page/pick-a-plan-page.component').then((c) => c.PickAPlanPageComponent),
                    },
                    {
                        path: 'payment-int',
                        pathMatch: 'full',
                        data: {
                            pageStepConfiguration: {
                                totalNumberOfSteps: 4,
                                currentStepNumber: 3,
                                routeUrlNext: '../payment',
                            },
                        },
                        loadComponent: () => import('./pages/payment-interstitial-page/payment-interstitial-page.component').then((c) => c.PaymentInterstitialPageComponent),
                    },
                    {
                        path: 'payment',
                        pathMatch: 'full',
                        data: {
                            pageStepConfiguration: {
                                totalNumberOfSteps: 4,
                                currentStepNumber: 3,
                                routeUrlNext: '../review',
                            },
                        },
                        loadComponent: () => import('./pages/payment-page/payment-page.component').then((c) => c.PaymentPageComponent),
                    },
                    {
                        path: 'review',
                        pathMatch: 'full',
                        data: {
                            pageStepConfiguration: {
                                totalNumberOfSteps: 4,
                                currentStepNumber: 4,
                                routeUrlNext: '../thanks',
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
        DeCareUseCasesCheckoutStateAddRadioRouterModule,
        DeCareSharedUiPageShellBasicModule,
    ],
    declarations: [],
})
export class DeCareUseCasesCheckoutFeatureAddRadioRouterModule {}
