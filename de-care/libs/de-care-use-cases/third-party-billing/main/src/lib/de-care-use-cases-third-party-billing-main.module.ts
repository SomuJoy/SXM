import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TempIncludeGlobalStyleScriptCanActivateService, UpdateUsecaseCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';

const routes: Route[] = [
    {
        path: '',
        component: PageShellBasicComponent,
        data: { pageShellBasic: { headerTheme: 'black' } as PageShellBasicRouteConfiguration, useCaseKey: 'SATELLITE_ORGANIC' },
        canActivate: [TempIncludeGlobalStyleScriptCanActivateService, UpdateUsecaseCanActivateService],
        loadChildren: () =>
            import('@de-care/de-care-use-cases/third-party-billing/feature-provision-account').then((m) => m.DeCareUseCasesThirdPartyBillingFeatureProvisionAccountModule),
    },
];

@NgModule({
    imports: [DeCareSharedUiPageShellBasicModule, RouterModule.forChild(routes)],
})
export class DeCareUseCasesThirdPartyBillingMainModule {}
