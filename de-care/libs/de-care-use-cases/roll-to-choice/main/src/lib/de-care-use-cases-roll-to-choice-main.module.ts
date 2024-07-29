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
                data: { useCaseKey: 'RTD_SATELLITE' },
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, UpdateUsecaseCanActivateService, LoadPackageDescriptionsCanActivateService],
                loadChildren: () =>
                    import('@de-care/de-care-use-cases/roll-to-choice/feature-plan-choice-organic').then((m) => m.DeCareUseCasesRollToChoiceFeaturePlanChoiceOrganicModule),
            },
        ]),
        DomainsOffersStatePackageDescriptionsModule,
        DeCareUseCasesSharedUiShellModule,
    ],
})
export class DeCareUseCasesRollToChoiceMainModule {}
