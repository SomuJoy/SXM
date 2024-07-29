import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { ReactiveFormsModule } from '@angular/forms';
import { DoNotCallFormComponent } from './page-parts/do-not-call-form/do-not-call-form.component';
import { DoNotCallFlowComponent } from './page/do-not-call-flow/do-not-call-flow.component';
import { SharedSxmUiUiLoadingIndicatorModule } from '@de-care/shared/sxm-ui/ui-loading-indicator';
import { SharedSxmUiUiNucaptchaModule } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { SxmUiModule } from '@de-care/sxm-ui';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { TempIncludeGlobalStyleScriptCanActivateService, TurnOffFullPageLoaderCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';

const routes: Routes = [
    {
        path: '',
        component: PageShellBasicComponent,
        data: { pageShellBasic: { headerTheme: 'black' } as PageShellBasicRouteConfiguration },
        canActivate: [TempIncludeGlobalStyleScriptCanActivateService, TurnOffFullPageLoaderCanActivateService],
        children: [
            {
                path: '',
                component: DoNotCallFlowComponent,
            },
        ],
    },
    { path: '**', redirectTo: '/error' },
];

const DECLARATIONS = [DoNotCallFormComponent, DoNotCallFlowComponent];

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        SharedSxmUiUiLoadingIndicatorModule,
        SharedSxmUiUiNucaptchaModule,
        SxmUiModule,
        DeCareSharedUiPageShellBasicModule,
    ],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS],
    providers: [],
})
export class DoNotCallModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, settingService: SettingsService, userSettingsService: UserSettingsService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/do-not-call.en-CA.json') },
            'en-US': { ...require('./i18n/do-not-call.en-US.json') },
            'fr-CA': { ...require('./i18n/do-not-call.fr-CA.json') },
        };

        if (settingService.isCanadaMode) {
            userSettingsService.setProvinceSelectionVisible(false);
        }

        super(translateService, languages);
    }
}
