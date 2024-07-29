import { PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { StepOfferPresentmentPageComponent } from '../pages/step-offer-presentment-page/step-offer-presentment-page.component';
import { StepTargetedReviewPageComponent } from '../pages/step-targeted-review-page/step-targeted-review-page.component';
import { PageStepRouteConfiguration } from './page-step-route-configuration';
import { PurchaseTargetedTransactionStateCanActivateService } from './purchase-targeted-transaction-state-can-activate.service';
import { PurchaseTargetedAddPlanCanActivateService } from './purchase-targeted-add-plan-can-activate.service';
import { Route, Routes } from '@angular/router';
const totalNumberOfSteps = 3;
const totalNumberOfStepsNonCredentialsRequired = 2;
const stepRoutesDefault: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: StepOfferPresentmentPageComponent,
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
                currentStepNumber: 1,
                routeUrlNext: '../creds',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
    },
    {
        path: 'creds',
        loadComponent: () => import('../pages/step-targeted-credentials-page/step-targeted-credentials-page.component').then((c) => c.StepTargetedCredentialsPageComponent),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 1,
                routeUrlNext: '../payment',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
    },
    {
        path: 'payment',
        loadComponent: () => import('../pages/step-targeted-payment-page/step-targeted-payment-page.component').then((c) => c.StepTargetedPaymentPageComponent),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 2,
                routeUrlNext: '../review',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
    },
    {
        path: 'review',
        component: StepTargetedReviewPageComponent,
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 3,
                routeUrlNext: '../thanks',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [PurchaseTargetedTransactionStateCanActivateService],
    },
];

const stepRoutesNonCredentialsRequired: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: StepOfferPresentmentPageComponent,
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps: totalNumberOfStepsNonCredentialsRequired,
                currentStepNumber: 1,
                routeUrlNext: 'payment',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
    },
    {
        path: 'payment',
        loadComponent: () => import('../pages/step-targeted-payment-page/step-targeted-payment-page.component').then((c) => c.StepTargetedPaymentPageComponent),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps: totalNumberOfStepsNonCredentialsRequired,
                currentStepNumber: 1,
                routeUrlNext: '../review',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
    },
    {
        path: 'review',
        component: StepTargetedReviewPageComponent,
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps: totalNumberOfStepsNonCredentialsRequired,
                currentStepNumber: 2,
                routeUrlNext: '../../../thanks',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [PurchaseTargetedTransactionStateCanActivateService],
    },
];

export const purchaseTargetedAddPlanRouting: Route = {
    path: '',
    component: PageShellBasicComponent,
    data: { pageShellBasic: { allowProvinceBar: true, disallowProvinceSelection: true } as PageShellBasicRouteConfiguration },
    canActivate: [PurchaseTargetedAddPlanCanActivateService],
    children: [
        {
            path: '',
            children: stepRoutesDefault,
        },
        {
            path: 'non-credentials-required',
            children: stepRoutesNonCredentialsRequired,
        },
    ],
};
