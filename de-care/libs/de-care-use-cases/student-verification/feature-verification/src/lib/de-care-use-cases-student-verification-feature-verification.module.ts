import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    DeCareUseCasesStudentVerificationStateVerificationModule,
    StudentVerificationNeededResolver,
} from '@de-care/de-care-use-cases/student-verification/state-verification';
import { PageShellBasicComponent, PageShellBasicRouteConfiguration, DeCareSharedUiPageShellBasicModule } from '@de-care/de-care/shared/ui-page-shell-basic';
// TODO: Legacy Modules, Need to be refactored
import { OffersModule } from '@de-care/offers';
// TODO: Legacy Modules, Need to be refactored
import { SalesCommonModule } from '@de-care/sales-common';
import { SharedSxmUiUiDealAddonCardModule } from '@de-care/shared/sxm-ui/ui-deal-addon-card';
import { SharedSxmUiUiHeroModule } from '@de-care/shared/sxm-ui/ui-hero';
import { SharedSxmUiUiLegalCopyModule } from '@de-care/shared/sxm-ui/ui-legal-copy';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SheerIdStudentVerificationComponent } from './pages/page-parts/sheer-id-student-verification/sheer-id-student-verification.component';
import { StudentVerificationLeadOfferDetailsComponent } from './pages/page-parts/student-verification-lead-offer-details/student-verification-lead-offer-details.component';
import { StudentVerificationFlowComponent } from './pages/student-verification-flow/student-verification-flow.component';

const DECLARATIONS = [StudentVerificationFlowComponent, SheerIdStudentVerificationComponent, StudentVerificationLeadOfferDetailsComponent];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: PageShellBasicComponent,
                data: { pageShellBasic: { allowProvinceBar: true, headerTheme: 'black' } as PageShellBasicRouteConfiguration },
                children: [
                    {
                        path: '',
                        component: StudentVerificationFlowComponent,
                        resolve: {
                            studentData: StudentVerificationNeededResolver,
                        },
                        data: {
                            isStreaming: true,
                        },
                    },
                ],
            },
        ]),
        TranslateModule.forChild(),
        LayoutModule,
        SharedSxmUiUiHeroModule,
        DeCareSharedUiPageShellBasicModule,
        DeCareUseCasesStudentVerificationStateVerificationModule,
        SharedSxmUiUiDealAddonCardModule,
        SharedSxmUiUiLegalCopyModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        OffersModule,
        SalesCommonModule,
        SharedSxmUiUiLegalCopyModule,
    ],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS],
})
export class DeCareUseCasesStudentVerificationFeatureVerificationModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, store: Store) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/feature-verification.en-CA.json'),
            'en-US': require('./i18n/feature-verification.en-US.json'),
            'fr-CA': require('./i18n/feature-verification.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
