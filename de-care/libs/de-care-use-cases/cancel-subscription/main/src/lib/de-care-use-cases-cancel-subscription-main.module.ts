import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TempIncludeGlobalStyleScriptCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DeCareUseCasesSharedUiShellModule, ShellComponent } from '@de-care/de-care-use-cases/shared/ui-shell';

const routes: Route[] = [
    {
        path: '',
        component: ShellComponent,
        canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
        loadChildren: () =>
            import('@de-care/de-care-use-cases/cancel-subscription/feature-cancel-request').then((m) => m.DeCareUseCasesCancelSubscriptionFeatureCancelRequestModule),
    },
];

@NgModule({
    imports: [DeCareUseCasesSharedUiShellModule, RouterModule.forChild(routes)],
})
export class DeCareUseCasesCancelSubscriptionMainModule {}
