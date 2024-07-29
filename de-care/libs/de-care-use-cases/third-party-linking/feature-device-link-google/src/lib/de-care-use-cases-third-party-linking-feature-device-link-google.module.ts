import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { DeCareUseCasesThirdPartyLinkingStateDeviceLinkGoogleModule } from '@de-care/de-care-use-cases/third-party-linking/state-device-link-google';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LandingPageCanActivateService } from './landing-page-can-activate.service';
import { TranslateModule } from '@ngx-translate/core';
import { SuccessPageComponent } from './pages/success-page/success-page.component';
import { TempIncludeGlobalStyleScriptCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { SupportPageComponent } from './pages/support-page/support-page.component';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { TermsAndConditionsPageComponent } from './pages/terms-and-conditions-page/terms-and-conditions-page.component';
import { LoadPageGuard } from './load-page-guard';

const routes: Route[] = [
    {
        path: '',
        component: PageShellBasicComponent,
        data: { pageShellBasic: { headerTheme: 'black' } as PageShellBasicRouteConfiguration },
        canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: LandingPageComponent,
                canActivate: [LoadPageGuard, LandingPageCanActivateService],
            },
            {
                path: 'success',
                component: SuccessPageComponent,
                canActivate: [LoadPageGuard],
            },
            {
                path: 'support',
                component: SupportPageComponent,
                canActivate: [LoadPageGuard],
            },
            {
                path: 'terms-and-conditions',
                component: TermsAndConditionsPageComponent,
                canActivate: [LoadPageGuard],
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        DeCareUseCasesThirdPartyLinkingStateDeviceLinkGoogleModule,
        DeCareSharedUiPageShellBasicModule,
        SharedSxmUiUiDataClickTrackModule,
    ],
    declarations: [LandingPageComponent, SuccessPageComponent, SupportPageComponent, TermsAndConditionsPageComponent],
})
export class DeCareUseCasesThirdPartyLinkingFeatureDeviceLinkGoogleModule {}
