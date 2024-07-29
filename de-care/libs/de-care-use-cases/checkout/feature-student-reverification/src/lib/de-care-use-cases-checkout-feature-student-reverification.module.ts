import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './lib.routes';
import { DeCareSharedUiPageShellBasicModule } from '@de-care/de-care/shared/ui-page-shell-basic';
import { DeCareUseCasesCheckoutStateStudentReverificationModule } from '@de-care/de-care-use-cases/checkout/state-student-reverification';

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), DeCareUseCasesCheckoutStateStudentReverificationModule, DeCareSharedUiPageShellBasicModule],
})
export class DeCareUseCasesCheckoutFeatureStudentReverificationModule {}
