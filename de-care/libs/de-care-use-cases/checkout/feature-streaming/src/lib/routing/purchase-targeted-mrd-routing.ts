import { PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { PurchaseTargetedMrdCanActivateService } from './purchase-targeted-mrd-can-activate.service';
import { PageStepRouteConfiguration } from './page-step-route-configuration';
import { MrdTransactionStateCanActivateService } from './mrd-transaction-state-can-activate.service';
import { StepTargetedMrdPaymentWithQuotesPageComponent } from '../pages/step-targeted-mrd-payment-with-quotes-page/step-targeted-mrd-payment-with-quotes-page.component';
import { Route, Routes } from '@angular/router';
import { StepPickAPlanMrdPageComponent } from '../pages/step-pick-a-plan-mrd-page/step-pick-a-plan-mrd-page.component';
import { LoadCardBinRangesAsyncCanActivateService, LoadPackageDescriptionsAsyncCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';

const totalNumberOfSteps = 4;
const totalNumberOfStepsForCombinedPaymentAndReview = 3;

const stepRoutesDefault: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: StepPickAPlanMrdPageComponent,
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 1,
                routeUrlNext: 'creds-int',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
    },
    {
        path: 'creds-int',
        loadComponent: () =>
            import('../pages/step-targeted-credentials-interstitial-page/step-targeted-credentials-interstitial-page.component').then(
                (c) => c.StepTargetedCredentialsInterstitialPageComponent
            ),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 2,
                routeUrlNext: '../creds',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [MrdTransactionStateCanActivateService],
    },
    {
        path: 'creds',
        loadComponent: () => import('../pages/step-targeted-credentials-page/step-targeted-credentials-page.component').then((c) => c.StepTargetedCredentialsPageComponent),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 2,
                routeUrlNext: '../payment-int',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [MrdTransactionStateCanActivateService],
    },
    {
        path: 'payment-int',
        loadComponent: () =>
            import('../pages/step-targeted-payment-interstitial-page/step-targeted-payment-interstitial-page.component').then(
                (c) => c.StepTargetedPaymentInterstitialPageComponent
            ),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 3,
                routeUrlNext: '../payment',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [MrdTransactionStateCanActivateService],
    },
    {
        path: 'payment',
        loadComponent: () => import('../pages/step-targeted-mrd-payment-page/step-targeted-mrd-payment-page.component').then((c) => c.StepTargetedMrdPaymentPageComponent),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 3,
                routeUrlNext: '../review',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [MrdTransactionStateCanActivateService],
    },
    // This will be an issue on merge, we need to check keep this page and lazy load it
    {
        path: 'review',
        loadComponent: () => import('../pages/step-targeted-review-mrd-page/step-targeted-review-mrd-page.component').then((c) => c.StepTargetedReviewMrdPageComponent),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 4,
                routeUrlNext: '../thanks',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [MrdTransactionStateCanActivateService],
    },
];

const stepRoutesCombinedPaymentWithReview: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: StepPickAPlanMrdPageComponent,
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps: totalNumberOfStepsForCombinedPaymentAndReview,
                currentStepNumber: 1,
                routeUrlNext: 'creds-int',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
    },
    {
        path: 'creds-int',
        loadComponent: () =>
            import('../pages/step-targeted-credentials-interstitial-page/step-targeted-credentials-interstitial-page.component').then(
                (c) => c.StepTargetedCredentialsInterstitialPageComponent
            ),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps: totalNumberOfStepsForCombinedPaymentAndReview,
                currentStepNumber: 2,
                routeUrlNext: '../creds',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [MrdTransactionStateCanActivateService],
    },
    {
        path: 'creds',
        loadComponent: () => import('../pages/step-targeted-credentials-page/step-targeted-credentials-page.component').then((c) => c.StepTargetedCredentialsPageComponent),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps: totalNumberOfStepsForCombinedPaymentAndReview,
                currentStepNumber: 2,
                routeUrlNext: '../payment-int',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [MrdTransactionStateCanActivateService],
    },
    {
        path: 'payment-int',
        loadComponent: () =>
            import('../pages/step-targeted-payment-interstitial-page/step-targeted-payment-interstitial-page.component').then(
                (c) => c.StepTargetedPaymentInterstitialPageComponent
            ),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps: totalNumberOfStepsForCombinedPaymentAndReview,
                currentStepNumber: 3,
                routeUrlNext: '../payment',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [MrdTransactionStateCanActivateService],
    },
    {
        path: 'payment',
        component: StepTargetedMrdPaymentWithQuotesPageComponent,
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps: totalNumberOfStepsForCombinedPaymentAndReview,
                currentStepNumber: 3,
                routeUrlNext: '../../../thanks',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [MrdTransactionStateCanActivateService],
    },
];

const stepRoutesCombinedPaymentWithReviewNoCredentailsInterstitials: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: StepPickAPlanMrdPageComponent,
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps: totalNumberOfStepsForCombinedPaymentAndReview,
                currentStepNumber: 1,
                routeUrlNext: 'creds',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
    },
    {
        path: 'creds',
        loadComponent: () => import('../pages/step-targeted-credentials-page/step-targeted-credentials-page.component').then((c) => c.StepTargetedCredentialsPageComponent),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps: totalNumberOfStepsForCombinedPaymentAndReview,
                currentStepNumber: 2,
                routeUrlNext: '../payment-int',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [MrdTransactionStateCanActivateService],
    },
    {
        path: 'payment-int',
        loadComponent: () =>
            import('../pages/step-targeted-payment-interstitial-page/step-targeted-payment-interstitial-page.component').then(
                (c) => c.StepTargetedPaymentInterstitialPageComponent
            ),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps: totalNumberOfStepsForCombinedPaymentAndReview,
                currentStepNumber: 3,
                routeUrlNext: '../payment',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [MrdTransactionStateCanActivateService],
    },
    {
        path: 'payment',
        component: StepTargetedMrdPaymentWithQuotesPageComponent,
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps: totalNumberOfStepsForCombinedPaymentAndReview,
                currentStepNumber: 3,
                routeUrlNext: '../../../thanks',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [MrdTransactionStateCanActivateService],
    },
];

export const purchaseTargetedMrdRouting: Route = {
    path: '',
    component: PageShellBasicComponent,
    data: { pageShellBasic: { allowProvinceBar: true, disallowProvinceSelection: true } as PageShellBasicRouteConfiguration },
    canActivate: [LoadPackageDescriptionsAsyncCanActivateService, LoadCardBinRangesAsyncCanActivateService, PurchaseTargetedMrdCanActivateService],
    children: [
        {
            path: '',
            children: stepRoutesDefault,
        },
        {
            path: 'variant1',
            children: stepRoutesCombinedPaymentWithReview,
        },
        {
            path: 'variant2',
            children: stepRoutesCombinedPaymentWithReviewNoCredentailsInterstitials,
        },
    ],
};
