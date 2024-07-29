import { Route, Routes } from '@angular/router';
import { PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { AddStreamingTransactionStateCanActivateService } from './add-streaming-transaction-state-can-activate.service';
import { PageStepRouteConfiguration } from './page-step-route-configuration';

const totalNumberOfSteps = 4;

const stepRoutesDefault: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
            import('../pages/step-add-streaming-pick-a-plan-page/step-add-streaming-pick-a-plan-page.component').then((c) => c.StepAddStreamingPickAPlanPageComponent),
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
        canActivate: [AddStreamingTransactionStateCanActivateService],
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
        canActivate: [AddStreamingTransactionStateCanActivateService],
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
        canActivate: [AddStreamingTransactionStateCanActivateService],
    },
    {
        path: 'payment',
        loadComponent: () =>
            import('../pages/step-targeted-add-streaming-payment-page/step-targeted-add-streaming-payment-page.component').then(
                (c) => c.StepTargetedAddStreamingPaymentPageComponent
            ),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 3,
                routeUrlNext: '../review',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [AddStreamingTransactionStateCanActivateService],
    },
    {
        path: 'review',
        loadComponent: () =>
            import('../pages/step-targeted-add-streaming-review-page/step-targeted-add-streaming-review-page.component').then(
                (c) => c.StepTargetedAddStreamingReviewPageComponent
            ),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 4,
                routeUrlNext: '../thanks',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [AddStreamingTransactionStateCanActivateService],
    },
];

export const purchaseTargetedAddStreamingRouting: Route = {
    path: '',
    component: PageShellBasicComponent,
    data: { pageShellBasic: { allowProvinceBar: true, disallowProvinceSelection: true } as PageShellBasicRouteConfiguration },
    children: [
        {
            path: '',
            children: stepRoutesDefault,
        },
    ],
};
