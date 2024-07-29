import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    UpdateUsecaseCanActivateService,
    LoadPackageDescriptionsCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DeCareUseCasesSharedUiShellModule, ShellComponent } from '@de-care/de-care-use-cases/shared/ui-shell';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ShellComponent,
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, UpdateUsecaseCanActivateService, LoadPackageDescriptionsCanActivateService],
                data: {
                    useCaseKey: 'SATELLITE_ORGANIC',
                },
                loadChildren: () =>
                    import('@de-care/de-care-use-cases/pick-a-plan/feature-plan-selection-organic').then((m) => m.DeCareUseCasesPickAPlanFeaturePlanSelectionOrganicModule),
            },
        ]),
        DomainsOffersStatePackageDescriptionsModule,
        DeCareUseCasesSharedUiShellModule,
    ],
})
export class DeCareUseCasesPickAPlanMainModule {}
