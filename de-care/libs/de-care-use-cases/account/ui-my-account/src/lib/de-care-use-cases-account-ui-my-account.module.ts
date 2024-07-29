import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancelLinksHybridBauComponent } from './cancel-links-hybrid-bau/cancel-links-hybrid-bau.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { OfferCardComponent } from './offer-card/offer-card.component';
import { SharedSxmUiDetailsColorWithCtaComponentModule } from '@de-care/shared/sxm-ui/marketing/ui-marketing';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), RouterModule, DomainsChatUiChatWithAgentLinkModule, SharedSxmUiDetailsColorWithCtaComponentModule],
    declarations: [CancelLinksHybridBauComponent, OfferCardComponent],
    exports: [CancelLinksHybridBauComponent, OfferCardComponent],
})
export class DeCareUseCasesAccountUiMyAccountModule {}
