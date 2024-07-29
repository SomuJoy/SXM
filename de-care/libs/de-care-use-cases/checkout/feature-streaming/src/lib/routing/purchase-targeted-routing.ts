import { PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { StepOfferPresentmentPageComponent } from '../pages/step-offer-presentment-page/step-offer-presentment-page.component';
import { StepTargetedReviewPageComponent } from '../pages/step-targeted-review-page/step-targeted-review-page.component';
import { PageStepRouteConfiguration } from './page-step-route-configuration';
import { PurchaseTargeteCanActivateService } from './purchase-targeted-can-activate.service';
import { PurchaseTargetedTransactionStateCanActivateService } from './purchase-targeted-transaction-state-can-activate.service';
import { Route, Routes } from '@angular/router';
import { LoadCardBinRangesAsyncCanActivateService, LoadPackageDescriptionsAsyncCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
const totalNumberOfSteps = 2;

const stepRoutesDefault: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: StepOfferPresentmentPageComponent,
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
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
                totalNumberOfSteps,
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
                totalNumberOfSteps,
                currentStepNumber: 2,
                routeUrlNext: '../thanks',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [PurchaseTargetedTransactionStateCanActivateService],
    },
];

export const purchaseTargeteRouting: Route = {
    path: '',
    component: PageShellBasicComponent,
    data: { pageShellBasic: { allowProvinceBar: true, disallowProvinceSelection: true } as PageShellBasicRouteConfiguration },
    canActivate: [LoadPackageDescriptionsAsyncCanActivateService, LoadCardBinRangesAsyncCanActivateService, PurchaseTargeteCanActivateService],
    children: [
        {
            path: '',
            children: stepRoutesDefault,
        },
    ],
};
