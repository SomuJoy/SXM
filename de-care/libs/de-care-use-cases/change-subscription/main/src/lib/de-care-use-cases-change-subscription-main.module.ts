import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {
    LoadPackageDescriptionsCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
    TurnOffFullPageLoaderCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';

const routes: Route[] = [
    {
        path: '',
        component: PageShellBasicComponent,
        data: { pageShellBasic: { headerTheme: 'black' } as PageShellBasicRouteConfiguration },
        canActivate: [TempIncludeGlobalStyleScriptCanActivateService, TurnOffFullPageLoaderCanActivateService, LoadPackageDescriptionsCanActivateService],
        loadChildren: () => import('@de-care/de-care-use-cases/change-subscription/feature-purchase').then((m) => m.DeCareUseCasesChangeSubscriptionFeaturePurchaseModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes), DeCareSharedUiPageShellBasicModule, DomainsOffersStatePackageDescriptionsModule],
})
export class DeCareUseCasesChangeSubscriptionMainModule {}
