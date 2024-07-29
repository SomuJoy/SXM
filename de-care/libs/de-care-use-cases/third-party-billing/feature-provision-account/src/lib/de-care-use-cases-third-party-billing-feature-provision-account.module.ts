import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SetupAccountComponent } from './pages/setup-account/setup-account.component';
import { AlreadyActiveComponent } from './pages/already-active/already-active.component';
import { ModuleWithTranslation, LanguageResources } from '@de-care/app-common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ProvisionAccountEntitlementFlowGuard } from './provision-account-entittlement-flow.guard';
import { DeCareUseCasesThirdPartyBillingStateProvisionAccountModule } from '@de-care/de-care-use-cases/third-party-billing/state-provision-account';
import { SxmUiModule } from '@de-care/sxm-ui';
import { DomainsAccountUiLoginFormFieldsModule } from '@de-care/domains/account/ui-login-form-fields';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { EntitlementErrorComponent } from './pages/error/entitlement-error.component';
import { SharedSxmUiUiListenNowButtonModule } from '@de-care/shared/sxm-ui/ui-listen-now-button';

const routes: Routes = [
    {
        path: '',
        canActivate: [ProvisionAccountEntitlementFlowGuard],
        component: SetupAccountComponent
    },
    {
        path: 'already-active',
        component: AlreadyActiveComponent
    },
    {
        path: 'error',
        component: EntitlementErrorComponent
    }
];

const declarations = [SetupAccountComponent, AlreadyActiveComponent, EntitlementErrorComponent];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        ReactiveFormsModule,
        DeCareUseCasesThirdPartyBillingStateProvisionAccountModule,
        DomainsAccountUiLoginFormFieldsModule,
        SxmUiModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiListenNowButtonModule
    ],
    declarations
})
export class DeCareUseCasesThirdPartyBillingFeatureProvisionAccountModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/feature-provision-account.en-CA.json') },
            'en-US': { ...require('./i18n/feature-provision-account.en-US.json') },
            'fr-CA': { ...require('./i18n/feature-provision-account.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
