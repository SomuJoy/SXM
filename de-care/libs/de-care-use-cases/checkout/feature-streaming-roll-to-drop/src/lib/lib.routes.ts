import { Route } from '@angular/router';
import {
    HidePageLoaderCanActivateService,
    GenericErrorPageComponent,
    ExpiredOfferErrorPageComponent,
    PromoCodeRedeemedErrorPageComponent,
} from '@de-care/de-care-use-cases/checkout/ui-common';
import {
    LoadIpLocationAndSetProvinceSyncCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
    TurnOffFullPageLoaderCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { PageStepRouteConfiguration } from './page-step-route-configuration';
import { PurchaseOrganicTransactionStateCanActivateService } from './purchase-organic-transaction-state-can-activate.service';

export const routes: Route[] = [
    {
        path: '',
        data: { pageShellBasic: { allowProvinceBar: true } as PageShellBasicRouteConfiguration },
        component: PageShellBasicComponent,
        canActivate: [TurnOffFullPageLoaderCanActivateService, LoadIpLocationAndSetProvinceSyncCanActivateService],
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./pages/purchase-organic-step-shell-page/purchase-organic-step-shell-page.component').then((mod) => mod.PurchaseOrganicStepShellPageComponent),
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        data: {
                            pageStepConfiguration: {
                                routeUrlNext: './creds',
                            } as PageStepRouteConfiguration,
                        },
                        loadComponent: () =>
                            import('./pages/step-organic-offer-presentment-page/step-organic-offer-presentment-page.component').then(
                                (c) => c.StepOrganicOfferPresentmentPageComponent
                            ),
                    },
                    {
                        path: 'creds',
                        pathMatch: 'full',
                        data: {
                            pageStepConfiguration: {
                                routeUrlNext: '../account-info-int',
                            } as PageStepRouteConfiguration,
                        },
                        canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
                        loadComponent: () =>
                            import('./pages/step-organic-credentials-page/step-organic-credentials-page.component').then((c) => c.StepOrganicCredentialsPageComponent),
                    },
                    {
                        path: 'account-info-int',
                        pathMatch: 'full',
                        data: {
                            pageStepConfiguration: {
                                routeUrlNext: '../account-info',
                                startOfFlowUrl: '../',
                            } as PageStepRouteConfiguration,
                        },
                        canActivate: [PurchaseOrganicTransactionStateCanActivateService],
                        loadComponent: () =>
                            import('./pages/step-organic-account-info-interstitial-page/step-organic-account-info-interstitial-page.component').then(
                                (c) => c.StepOrganicAccountInfoInterstitialPageComponent
                            ),
                    },
                    {
                        path: 'account-info',
                        canActivate: [PurchaseOrganicTransactionStateCanActivateService],
                        data: {
                            pageStepConfiguration: {
                                routeUrlNext: '../follow-on-option',
                                confirmationUrl: '../confirmation',
                                startOfFlowUrl: '../',
                            } as PageStepRouteConfiguration,
                        },
                        loadComponent: () =>
                            import('./pages/step-organic-account-info-setup-page/step-organic-account-info-setup-page.component').then(
                                (c) => c.StepOrganicAccountInfoSetupPageComponent
                            ),
                    },
                    {
                        path: 'follow-on-option',
                        canActivate: [PurchaseOrganicTransactionStateCanActivateService],
                        data: {
                            pageStepConfiguration: {
                                routeUrlNext: '../setup-payment',
                                confirmationUrl: '../confirmation',
                                startOfFlowUrl: '../',
                            } as PageStepRouteConfiguration,
                        },
                        loadComponent: () =>
                            import('./pages/step-organic-follow-on-option-page/step-organic-follow-on-option-page.component').then(
                                (c) => c.StepOrganicFollowOnOptionPageComponent
                            ),
                    },
                ],
            },
            {
                path: 'setup-payment',
                canActivate: [PurchaseOrganicTransactionStateCanActivateService],
                data: {
                    pageStepConfiguration: {
                        routeUrlNext: '../review',
                        startOfFlowUrl: '../',
                    } as PageStepRouteConfiguration,
                },
                loadComponent: () =>
                    import('./pages/step-organic-setup-payment-page/step-organic-setup-payment-page.component').then((c) => c.StepOrganicSetupPaymentPageComponent),
            },
            {
                path: 'review',
                data: {
                    pageStepConfiguration: {
                        routeUrlNext: '../confirmation',
                    } as PageStepRouteConfiguration,
                },
                loadComponent: () => import('./pages/step-organic-review-page/step-organic-review-page.component').then((c) => c.StepOrganicReviewPageComponent),
            },
            {
                path: 'confirmation',
                data: {
                    pageStepConfiguration: {
                        routeUrlNext: '',
                    } as PageStepRouteConfiguration,
                },
                loadComponent: () =>
                    import('./pages/step-organic-confirmation-page/step-organic-confirmation-page.component').then((c) => c.StepOrganicConfirmationPageComponent),
            },
        ],
    },
    {
        path: 'generic-error',
        pathMatch: 'full',
        component: PageShellBasicComponent,
        data: { pageShellBasic: { headerTheme: 'gray' } as PageShellBasicRouteConfiguration },
        canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: GenericErrorPageComponent,
                data: { ctaURL: 'subscribe/checkout/purchase/streaming/organic' },
                canActivate: [HidePageLoaderCanActivateService],
            },
        ],
    },
    {
        path: 'expired-offer-error',
        pathMatch: 'full',
        component: PageShellBasicComponent,
        data: { pageShellBasic: { headerTheme: 'gray' } as PageShellBasicRouteConfiguration },
        canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: ExpiredOfferErrorPageComponent,
                data: { ctaURL: 'subscribe/checkout/purchase/streaming/organic' },
                canActivate: [HidePageLoaderCanActivateService],
            },
        ],
    },
    {
        path: 'promo-code-redeemed-error',
        pathMatch: 'full',
        component: PageShellBasicComponent,
        data: { pageShellBasic: { headerTheme: 'gray' } as PageShellBasicRouteConfiguration },
        canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: PromoCodeRedeemedErrorPageComponent,
                data: { ctaURL: 'subscribe/checkout/purchase/streaming/organic' },
                canActivate: [HidePageLoaderCanActivateService],
            },
        ],
    },
];
