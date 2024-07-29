import { Route } from '@angular/router';
import { TurnOffFullPageLoaderCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { importProvidersFrom } from '@angular/core';
import { DeCareUseCasesCheckoutStateStreamingSelfPayOrganicModule } from '@de-care/de-care-use-cases/checkout/state-streaming-self-pay-organic';

export const routes: Route[] = [
    {
        path: '',
        canActivate: [TurnOffFullPageLoaderCanActivateService],
        providers: [importProvidersFrom(DeCareUseCasesCheckoutStateStreamingSelfPayOrganicModule)],
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadComponent: () => import('./pages/offer-presentment-page/offer-presentment-page.component').then((module) => module.OfferPresentmentPageComponent),
            },
        ],
    },
];
