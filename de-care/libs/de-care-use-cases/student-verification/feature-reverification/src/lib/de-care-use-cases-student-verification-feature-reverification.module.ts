import {
    DeCareUseCasesStudentVerificationStateReVerificationModule,
    StudentReVerificationNeededResolver,
} from '@de-care/de-care-use-cases/student-verification/state-reverification';
import { DeCareUseCasesStudentVerificationUiStudentReVerificationModule } from '@de-care/de-care-use-cases/student-verification/ui-student-re-verification';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentReverificationFlowComponent } from './pages/student-reverification-flow/student-reverification-flow.component';
import { LoadStudentReverifyCanActivateService } from './load-student-reverify-can-activate.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutModule } from '@angular/cdk/layout';
import { InvalidTokenPageComponent } from './pages/invalid-token-page/invalid-token-page.component';
import { DomainsOffersUiHeroModule } from '@de-care/domains/offers/ui-hero';
import { Store } from '@ngrx/store';
import { SharedSxmUiUiLegalCopyModule } from '@de-care/shared/sxm-ui/ui-legal-copy';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { PageShellBasicComponent, PageShellBasicRouteConfiguration, DeCareSharedUiPageShellBasicModule } from '@de-care/de-care/shared/ui-page-shell-basic';
import { SalesCommonModule } from '@de-care/sales-common';

const DECLARATIONS = [StudentReverificationFlowComponent, InvalidTokenPageComponent];

@NgModule({
    imports: [
        CommonModule,
        DeCareSharedUiPageShellBasicModule,
        RouterModule.forChild([
            {
                path: '',
                component: PageShellBasicComponent,
                data: { pageShellBasic: { allowProvinceBar: true, headerTheme: 'black' } as PageShellBasicRouteConfiguration, useCaseKey: 'PKG_UPGRADE_FULL_PRICE' },
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: StudentReverificationFlowComponent,
                        resolve: {
                            studentData: StudentReVerificationNeededResolver,
                        },
                        canActivate: [LoadStudentReverifyCanActivateService],
                        data: {
                            isStreaming: true,
                        },
                    },
                    {
                        path: 'confirm',
                        loadChildren: () =>
                            // TODO: Need to be refactored
                            import('@de-care/de-care-use-cases/student-verification/feature-confirm-re-verify').then(
                                (m) => m.DeCareUseCasesStudentVerificationFeatureConfirmReVerifyModule
                            ),
                    },
                    {
                        path: 'error',
                        component: InvalidTokenPageComponent,
                    },
                ],
            },
        ]),
        TranslateModule.forChild(),
        DeCareUseCasesStudentVerificationStateReVerificationModule,
        LayoutModule,
        DomainsOffersUiHeroModule,
        DeCareUseCasesStudentVerificationUiStudentReVerificationModule,
        SharedSxmUiUiLegalCopyModule,
        SalesCommonModule,
        DeCareSharedUiPageShellBasicModule,
    ],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS],
})
export class DeCareUseCasesStudentVerificationFeatureReverificationModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, store: Store) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/feature-reverification.en-CA.json'),
            'en-US': require('./i18n/feature-reverification.en-US.json'),
            'fr-CA': require('./i18n/feature-reverification.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
