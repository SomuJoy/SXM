import { DeCareUseCasesSharedUiShellModule, ShellComponent } from '@de-care/de-care-use-cases/shared/ui-shell';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    LoadPackageDescriptionsCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
    UpdateUsecaseCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';

@NgModule({
    imports: [
        CommonModule,
        DeCareUseCasesSharedUiShellModule,
        DomainsOffersStatePackageDescriptionsModule,
        RouterModule.forChild([
            {
                path: '',
                data: { useCaseKey: 'RTD_STREAMING', keepCustomerInfo: true },
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, UpdateUsecaseCanActivateService, LoadPackageDescriptionsCanActivateService],
                children: [
                    {
                        path: 'streaming',
                        component: ShellComponent,
                        loadChildren: () => import('@de-care/de-care-use-cases/roll-to-drop/feature-streaming').then((m) => m.DeCareUseCasesRollToDropFeatureStreamingModule),
                    },
                    {
                        path: 'streaming/tokenized',
                        component: ShellComponent,
                        loadChildren: () =>
                            import('@de-care/de-care-use-cases/roll-to-drop/feature-streaming-tokenized').then(
                                (m) => m.DeCareUseCasesRollToDropFeatureStreamingTokenizedModule
                            ),
                    },
                ],
            },
        ]),
    ],
})
export class DeCareUseCasesRollToDropMainModule {}
