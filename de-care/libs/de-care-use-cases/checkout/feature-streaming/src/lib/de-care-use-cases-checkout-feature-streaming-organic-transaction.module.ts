import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TempIncludeGlobalStyleScriptCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { StepOrganicCredentialsPageComponent, StepOrganicCredentialsPageComponentModule } from './pages/step-organic-credentials-page/step-organic-credentials-page.component';
import {
    StepOrganicPaymentInterstitialPageComponent,
    StepOrganicPaymentInterstitialPageComponentModule,
} from './pages/step-organic-payment-interstitial-page/step-organic-payment-interstitial-page.component';
import { StepOrganicReviewPageComponent, StepOrganicReviewPageComponentModule } from './pages/step-organic-review-page/step-organic-review-page.component';
import { PageStepRouteConfiguration } from './routing/page-step-route-configuration';
import { PurchaseOrganicTransactionStateCanActivateService } from './routing/purchase-organic-transaction-state-can-activate.service';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'creds',
                component: StepOrganicCredentialsPageComponent,
                data: {
                    pageStepConfiguration: {
                        totalNumberOfSteps: 3,
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
                        totalNumberOfSteps: 3,
                        currentStepNumber: 2,
                        routeUrlNext: '../payment',
                        startOfFlowUrl: '../',
                    } as PageStepRouteConfiguration,
                },
                canActivate: [PurchaseOrganicTransactionStateCanActivateService],
            },
            {
                path: 'payment',
                loadComponent: () => import('./pages/step-organic-payment-page/step-organic-payment-page.component').then((c) => c.StepOrganicPaymentPageComponent),
                data: {
                    pageStepConfiguration: {
                        totalNumberOfSteps: 3,
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
                        totalNumberOfSteps: 3,
                        currentStepNumber: 3,
                        routeUrlNext: '../thanks',
                        credentialsRouteUrl: '../creds',
                        paymentMethodRouteUrl: '../payment',
                        startOfFlowUrl: '../',
                    } as PageStepRouteConfiguration,
                },
                canActivate: [PurchaseOrganicTransactionStateCanActivateService],
            },
        ]),
        StepOrganicCredentialsPageComponentModule,
        StepOrganicPaymentInterstitialPageComponentModule,
        StepOrganicReviewPageComponentModule,
    ],
})
export class DeCareUseCasesCheckoutFeatureStreamingOrganicTransactionModule {}
