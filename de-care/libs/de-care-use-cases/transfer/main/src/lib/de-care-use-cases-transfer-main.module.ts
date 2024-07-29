import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeCareUseCasesSharedUiShellModule, ShellWithAccountNumberComponent } from '@de-care/de-care-use-cases/shared/ui-shell';
import {
    LoadPackageDescriptionsCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
    UpdateUsecaseCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                // Account Consolidation and Service Continuity targeted
                path: 'radio',
                component: ShellWithAccountNumberComponent,
                data: { useCaseKey: 'AC_SC' },
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, UpdateUsecaseCanActivateService, LoadPackageDescriptionsCanActivateService],
                loadChildren: () => import('@de-care/de-care-use-cases/transfer/feature-acsc-targeted').then((m) => m.DeCareUseCasesTransferFeatureACSCTargetedModule),
            },
        ]),
        DomainsOffersStatePackageDescriptionsModule,
        DeCareUseCasesSharedUiShellModule,
    ],
})
export class DeCareUseCasesTransferMainModule {}
