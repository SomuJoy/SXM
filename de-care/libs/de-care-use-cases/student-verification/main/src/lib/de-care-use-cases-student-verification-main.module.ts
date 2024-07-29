import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
    LoadPackageDescriptionsCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
    UpdateUsecaseCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';

@NgModule({
    imports: [
        CommonModule,
        DomainsOffersStatePackageDescriptionsModule,
        RouterModule.forChild([
            {
                path: '',
                data: { useCaseKey: 'STUDENT_STREAMING' },
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, UpdateUsecaseCanActivateService],
                children: [
                    {
                        path: '',
                        canActivate: [LoadPackageDescriptionsCanActivateService],
                        loadChildren: () =>
                            import('@de-care/de-care-use-cases/student-verification/feature-verification').then(
                                (m) => m.DeCareUseCasesStudentVerificationFeatureVerificationModule
                            ),
                    },
                    {
                        path: 're-verify',
                        canActivate: [LoadPackageDescriptionsCanActivateService],
                        loadChildren: () =>
                            import('@de-care/de-care-use-cases/student-verification/feature-reverification').then(
                                (m) => m.DeCareUseCasesStudentVerificationFeatureReverificationModule
                            ),
                    },
                ],
            },
        ]),
    ],
})
export class DeCareUseCasesStudentVerificationMainModule {}
