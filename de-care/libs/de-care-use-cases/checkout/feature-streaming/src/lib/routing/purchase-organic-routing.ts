import { PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { PurchaseOrganicCanActivateService } from './purchase-organic-can-activate.service';
import { PurchaseOrganicStepShellPageComponent } from '../pages/purchase-organic-step-shell-page/purchase-organic-step-shell-page.component';
import { StepOfferPresentmentPageComponent } from '../pages/step-offer-presentment-page/step-offer-presentment-page.component';
import { StepOrganicCredentialsPageComponent } from '../pages/step-organic-credentials-page/step-organic-credentials-page.component';
import { StepOrganicPaymentInterstitialPageComponent } from '../pages/step-organic-payment-interstitial-page/step-organic-payment-interstitial-page.component';
import { StepOrganicPaymentPageComponent } from '../pages/step-organic-payment-page/step-organic-payment-page.component';
import { StepOrganicPaymentWithQuotesPageComponent } from '../pages/step-organic-payment-with-quotes-page/step-organic-payment-with-quotes-page.component';
import { StepOrganicReviewPageComponent } from '../pages/step-organic-review-page/step-organic-review-page.component';
import { PageStepRouteConfiguration } from './page-step-route-configuration';
import { PaymentAndReviewCanActivateService } from './payment-and-review-can-activate.service';
import { PurchaseOrganicAmexCanActivateService } from './purchase-organic-amex-can-activate.service';
import { PurchaseOrganicTransactionStateCanActivateService } from './purchase-organic-transaction-state-can-activate.service';
import { Route, Routes } from '@angular/router';
import {
    LoadCardBinRangesAsyncCanActivateService,
    LoadPackageDescriptionsAsyncCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';

const totalNumberOfSteps = 3;
const totalNumberOfStepsForCombinedPaymentAndReview = 2;

const stepRoutesDefault: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: StepOfferPresentmentPageComponent,
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 1,
                routeUrlNext: './creds-int',
            } as PageStepRouteConfiguration,
        },
    },
    {
        path: 'creds-int',
        loadComponent: () =>
            import('../pages/step-organic-credentials-interstitial-page/step-organic-credentials-interstitial-page.component').then(
                (mod) => mod.StepOrganicCredentialsInterstitialPageComponent
            ),
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 1,
                routeUrlNext: '../creds',
            } as PageStepRouteConfiguration,
        },
    },
    {
        path: 'creds',
        component: StepOrganicCredentialsPageComponent,
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 1,
                routeUrlNext: '../payment-int',
            } as PageStepRouteConfiguration,
        },
        canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
    },
    {
        path: 'payment-int',
        component: StepOrganicPaymentInterstitialPageComponent,
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 2,
                routeUrlNext: '../payment',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [PurchaseOrganicTransactionStateCanActivateService],
    },
    {
        path: 'payment',
        component: StepOrganicPaymentPageComponent,
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 2,
                routeUrlNext: '../review',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [PurchaseOrganicTransactionStateCanActivateService],
    },
    {
        path: 'review',
        component: StepOrganicReviewPageComponent,
        data: {
            pageStepConfiguration: {
                totalNumberOfSteps,
                currentStepNumber: 3,
                routeUrlNext: '../thanks',
                credentialsRouteUrl: '../creds',
                paymentMethodRouteUrl: '../payment',
                startOfFlowUrl: '../',
            } as PageStepRouteConfiguration,
        },
        canActivate: [PurchaseOrganicTransactionStateCanActivateService],
    },
];

export const purchaseOrganicRouting: Route = {
    path: '',
    component: PageShellBasicComponent,
    data: { pageShellBasic: { allowProvinceBar: true } as PageShellBasicRouteConfiguration },
    children: [
        {
            path: '',
            component: PurchaseOrganicStepShellPageComponent,
            children: [
                {
                    path: '',
                    canActivate: [LoadPackageDescriptionsAsyncCanActivateService, LoadCardBinRangesAsyncCanActivateService, PurchaseOrganicCanActivateService],
                    children: stepRoutesDefault,
                },
                {
                    path: 'amex',
                    children: stepRoutesDefault,
                    canActivate: [
                        TempIncludeGlobalStyleScriptCanActivateService,
                        LoadPackageDescriptionsAsyncCanActivateService,
                        LoadCardBinRangesAsyncCanActivateService,
                        PurchaseOrganicAmexCanActivateService,
                    ],
                },
            ],
        },
    ],
};
