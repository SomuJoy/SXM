import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanDescriptionChannelsComponent } from './plan-description-channels/plan-description-channels.component';
import { PlanDescriptionChannelsOemComponent } from './plan-description-channels/plan-description-channels-oem.component';

@NgModule({
    imports: [CommonModule],
    declarations: [PlanDescriptionChannelsComponent, PlanDescriptionChannelsOemComponent],
    exports: [PlanDescriptionChannelsComponent, PlanDescriptionChannelsOemComponent]
})
export class DomainsOffersUiPlanDescriptionChannelsModule {}
