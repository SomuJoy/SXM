import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TempIncludeGlobalStyleScriptCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { ShellComponent } from '@de-care/de-care-use-cases/shared/ui-shell';

const routes: Route[] = [
    {
        path: 'registration',
        component: ShellComponent,
        canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
        loadChildren: () => import('@de-care/de-care-use-cases/account/feature-registration').then((m) => m.DeCareUseCasesAccountFeatureRegistrationModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class DeCareUseCasesAccountMainModule {}
