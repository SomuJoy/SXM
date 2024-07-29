import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TempIncludeGlobalStyleScriptCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'device-link-amazon',
                component: PageShellBasicComponent,
                data: { pageShellBasic: { headerTheme: 'black' } as PageShellBasicRouteConfiguration },
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
                loadChildren: () =>
                    import('@de-care/de-care-use-cases/third-party-linking/feature-device-link-amazon').then(
                        (m) => m.DeCareUseCasesThirdPartyLinkingFeatureDeviceLinkAmazonModule
                    ),
            },
        ]),
        DeCareSharedUiPageShellBasicModule,
    ],
})
export class DeCareUseCasesThirdPartyLinkingMainModule {}
