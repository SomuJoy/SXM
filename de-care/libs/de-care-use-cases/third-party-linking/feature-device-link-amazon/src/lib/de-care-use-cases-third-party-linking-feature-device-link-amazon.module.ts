import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { SuccessPageComponent } from './pages/success-page/success-page.component';
import { LoginCompleteHandlerPageComponent } from './pages/login-complete-handler-page/login-complete-handler-page.component';
import { DeCareUseCasesThirdPartyLinkingStateDeviceLinkAmazonModule } from '@de-care/de-care-use-cases/third-party-linking/state-device-link-amazon';
import { LandingPageCanActivateService } from './landing-page-can-activate.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: LandingPageComponent,
                pathMatch: 'full',
                canActivate: [LandingPageCanActivateService]
            },
            { path: 'success', component: SuccessPageComponent },
            { path: 'error', component: ErrorPageComponent },
            { path: 'amzauth', component: LoginCompleteHandlerPageComponent }
        ]),
        TranslateModule.forChild(),
        DeCareUseCasesThirdPartyLinkingStateDeviceLinkAmazonModule
    ],
    declarations: [LandingPageComponent, ErrorPageComponent, SuccessPageComponent, LoginCompleteHandlerPageComponent]
})
export class DeCareUseCasesThirdPartyLinkingFeatureDeviceLinkAmazonModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
