import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './lib.routes';
import { DeCareSharedUiPageShellBasicModule } from '@de-care/de-care/shared/ui-page-shell-basic';
import { DeCareUseCasesCheckoutStateStudentVerificationModule } from '@de-care/de-care-use-cases/checkout/state-student-verification';

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), DeCareUseCasesCheckoutStateStudentVerificationModule, DeCareSharedUiPageShellBasicModule],
})
export class DeCareUseCasesCheckoutFeatureStudentVerificationModule {}
