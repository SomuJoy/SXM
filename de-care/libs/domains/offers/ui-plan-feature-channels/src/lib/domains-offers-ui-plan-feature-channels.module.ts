import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanFeatureChannelsComponent } from './plan-feature-channels/plan-feature-channels.component';
import { SxmUiModule } from '@de-care/sxm-ui';

@NgModule({
    imports: [CommonModule, SxmUiModule],
    declarations: [PlanFeatureChannelsComponent],
    exports: [PlanFeatureChannelsComponent]
})
export class DomainsOffersUiPlanFeatureChannelsModule {}
