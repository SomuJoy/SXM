import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent } from '@de-care/de-care/shared/ui-page-shell-basic';
import { DeCareUseCasesCheckoutStateSatelliteModule } from '@de-care/de-care-use-cases/checkout/state-satellite';
import { TempIncludeGlobalStyleScriptCanActivateService, TurnOffFullPageLoaderCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { PageStepRouteConfiguration } from './routing/page-step-route-configuration';
import { PurchaseTargetedTransactionStateCanActivateService } from './routing/purchase-targeted-transaction-state-can-activate.service';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PageShellBasicComponent,
                canActivate: [TurnOffFullPageLoaderCanActivateService],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        data: {
                            pageStepConfiguration: {
                                currentStepNumber: 1,
                                totalNumberOfSteps: 3,
                                routeUrlNext: './device-lookup',
                            } as PageStepRouteConfiguration,
                        },
                        loadComponent: () =>
                            import('./pages/step-organic-offer-presentment-page/step-organic-offer-presentment-page.component').then(
                                (c) => c.StepOrganicOfferPresentmentPageComponent
                            ),
                    },
                    {
                        path: 'device-lookup',
                        pathMatch: 'full',
                        canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
                        data: {
                            pageStepConfiguration: {
                                currentStepNumber: 1,
                                totalNumberOfSteps: 3,
                                routeUrlNext: '../payment-int',
                            } as PageStepRouteConfiguration,
                        },
                        loadComponent: () =>
                            import('./pages/step-organic-device-lookup-page/step-organic-device-lookup-page.component').then((c) => c.StepOrganicDeviceLookupPageComponent),
                    },
                    {
                        path: 'payment-int',
                        data: {
                            pageStepConfiguration: {
                                totalNumberOfSteps: 3,
                                currentStepNumber: 2,
                                routeUrlNext: '../payment',
                            } as PageStepRouteConfiguration,
                        },
                        loadComponent: () =>
                            import('./pages/step-organic-payment-interstitial-page/step-organic-payment-interstitial-page.component').then(
                                (mod) => mod.StepOrganicPaymentInterstitialPageComponent
                            ),
                    },
                    {
                        path: 'payment',
                        data: {
                            pageStepConfiguration: {
                                totalNumberOfSteps: 3,
                                currentStepNumber: 2,
                                routeUrlNext: '../review',
                            } as PageStepRouteConfiguration,
                        },
                        canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
                        loadComponent: () => import('./pages/step-payment-page/step-payment-page.component').then((mod) => mod.StepPaymentPageComponent),
                    },
                    {
                        path: 'review',
                        data: {
                            pageStepConfiguration: {
                                totalNumberOfSteps: 3,
                                currentStepNumber: 3,
                                routeUrlNext: '../../thanks',
                                paymentMethodRouteUrl: '../payment',
                                startOfFlowUrl: '../',
                            } as PageStepRouteConfiguration,
                        },
                        canActivate: [PurchaseTargetedTransactionStateCanActivateService],
                        loadComponent: () =>
                            import('./pages/step-targeted-review-page/step-targeted-review-page.component').then((mod) => mod.StepTargetedReviewPageComponent),
                    },
                ],
            },
        ]),
        DeCareSharedUiPageShellBasicModule,
        DeCareUseCasesCheckoutStateSatelliteModule,
    ],
})
export class DeCareUseCasesCheckoutFeatureSatelliteOrganicModule {}
