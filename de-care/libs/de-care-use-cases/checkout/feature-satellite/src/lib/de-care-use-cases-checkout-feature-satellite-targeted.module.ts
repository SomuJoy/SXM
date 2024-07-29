import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeCareUseCasesCheckoutStateSatelliteModule } from '@de-care/de-care-use-cases/checkout/state-satellite';
import {
    LoadIpLocationAndSetProvinceAsyncCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
    TurnOffFullPageLoaderCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent } from '@de-care/de-care/shared/ui-page-shell-basic';
import { PageStepRouteConfiguration } from './routing/page-step-route-configuration';
import { PurchaseTargetedTransactionStateCanActivateService } from './routing/purchase-targeted-transaction-state-can-activate.service';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                data: { useCaseKey: 'SATELLITE_TARGETED' },
                canActivate: [TurnOffFullPageLoaderCanActivateService, LoadIpLocationAndSetProvinceAsyncCanActivateService],
                component: PageShellBasicComponent,
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        data: {
                            pageStepConfiguration: {
                                totalNumberOfSteps: 2,
                                currentStepNumber: 1,
                                routeUrlNext: './payment-int',
                            } as PageStepRouteConfiguration,
                        },
                        loadComponent: () =>
                            import('./pages/step-targeted-offer-presentment-page/step-targeted-offer-presentment-page.component').then(
                                (mod) => mod.StepTargetedOfferPresentmentPageComponent
                            ),
                    },
                    {
                        path: 'payment-int',
                        data: {
                            pageStepConfiguration: {
                                totalNumberOfSteps: 2,
                                currentStepNumber: 1,
                                routeUrlNext: '../payment',
                            } as PageStepRouteConfiguration,
                        },
                        loadComponent: () =>
                            import('./pages/step-targeted-payment-interstitial-page/step-targeted-payment-interstitial-page.component').then(
                                (mod) => mod.StepTargetedPaymentInterstitialPageComponent
                            ),
                    },
                    {
                        path: 'payment',
                        data: {
                            pageStepConfiguration: {
                                totalNumberOfSteps: 2,
                                currentStepNumber: 1,
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
                                totalNumberOfSteps: 2,
                                currentStepNumber: 2,
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
export class DeCareUseCasesCheckoutFeatureSatelliteTargetedModule {}
