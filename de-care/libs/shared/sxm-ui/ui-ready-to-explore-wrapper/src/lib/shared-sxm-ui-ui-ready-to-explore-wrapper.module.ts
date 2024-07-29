import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadyToExploreWrapperComponent } from './ready-to-explore-wrapper/ready-to-explore-wrapper.component';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';

@NgModule({
    imports: [CommonModule, DomainsSubscriptionsUiPlayerAppIntegrationModule],
    declarations: [ReadyToExploreWrapperComponent],
    exports: [ReadyToExploreWrapperComponent],
})
export class SharedSxmUiUiReadyToExploreWrapperModule {}
