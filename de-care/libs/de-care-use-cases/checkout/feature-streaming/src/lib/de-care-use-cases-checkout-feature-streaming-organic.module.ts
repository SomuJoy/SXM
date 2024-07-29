import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeCareUseCasesCheckoutStateStreamingModule } from '@de-care/de-care-use-cases/checkout/state-streaming';
import { LoadIpLocationAndSetProvinceAsyncCanActivateService, TurnOffFullPageLoaderCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { PageStepRouteConfiguration } from './routing/page-step-route-configuration';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                data: { pageShellBasic: { allowProvinceBar: true } as PageShellBasicRouteConfiguration },
                canActivate: [TurnOffFullPageLoaderCanActivateService, LoadIpLocationAndSetProvinceAsyncCanActivateService],
                component: PageShellBasicComponent,
                children: [
                    {
                        path: '',
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                data: {
                                    pageStepConfiguration: {
                                        totalNumberOfSteps: 3,
                                        currentStepNumber: 1,
                                        routeUrlNext: './creds-int',
                                    } as PageStepRouteConfiguration,
                                },
                                loadComponent: () =>
                                    import('./pages/step-organic-offer-presentment-page/step-organic-offer-presentment-page.component').then(
                                        (mod) => mod.StepOrganicOfferPresentmentPageComponent
                                    ),
                            },
                            {
                                path: 'creds-int',
                                data: {
                                    pageStepConfiguration: {
                                        totalNumberOfSteps: 3,
                                        currentStepNumber: 1,
                                        routeUrlNext: '../creds',
                                    } as PageStepRouteConfiguration,
                                },
                                loadComponent: () =>
                                    import('./pages/step-organic-credentials-interstitial-page/step-organic-credentials-interstitial-page.component').then(
                                        (mod) => mod.StepOrganicCredentialsInterstitialPageComponent
                                    ),
                            },
                            {
                                path: '',
                                loadChildren: () =>
                                    import('./de-care-use-cases-checkout-feature-streaming-organic-transaction.module').then(
                                        (mod) => mod.DeCareUseCasesCheckoutFeatureStreamingOrganicTransactionModule
                                    ),
                            },
                        ],
                    },
                ],
            },
        ]),
        DeCareSharedUiPageShellBasicModule,
        DeCareUseCasesCheckoutStateStreamingModule,
    ],
})
export class DeCareUseCasesCheckoutFeatureStreamingOrganicModule {}
