import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeCareUseCasesCheckoutStateStreamingRollToDropModule } from '@de-care/de-care-use-cases/checkout/state-streaming-roll-to-drop';
import { routes } from './lib.routes';
import { DeCareSharedUiPageShellBasicModule } from '@de-care/de-care/shared/ui-page-shell-basic';

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), DeCareUseCasesCheckoutStateStreamingRollToDropModule, DeCareSharedUiPageShellBasicModule],
})
export class DeCareUseCasesCheckoutFeatureStreamingRollToDropModule {}
