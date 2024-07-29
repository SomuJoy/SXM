import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealAddonCardComponent } from './deal-addon-card/deal-addon-card.component';
import { SharedSxmUiUiContentCardModule } from '@de-care/shared/sxm-ui/ui-content-card';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { SxmUiDealAddonPanelComponent } from './deal-addon-panel/deal-addon-panel.component';
import { SxmUiDealRedemptionInstructionsComponent } from './deal-redemption-instructions/deal-redemption-instructions.component';
import { SxmUiDealRedemptionInstructionsWithCtaComponent } from './deal-redemption-instructions-with-cta/deal-redemption-instructions-with-cta.component';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { DealAddonCardSeparatedComponent } from './deal-addon-card-separated/deal-addon-card-separated.component';

@NgModule({
    imports: [CommonModule, SharedSxmUiUiContentCardModule, SharedSxmUiUiAccordionChevronModule, SharedSxmUiUiProceedButtonModule],
    declarations: [
        DealAddonCardComponent,
        DealAddonCardSeparatedComponent,
        SxmUiDealAddonPanelComponent,
        SxmUiDealRedemptionInstructionsComponent,
        SxmUiDealRedemptionInstructionsWithCtaComponent,
    ],
    exports: [
        DealAddonCardComponent,
        DealAddonCardSeparatedComponent,
        SxmUiDealAddonPanelComponent,
        SxmUiDealRedemptionInstructionsComponent,
        SxmUiDealRedemptionInstructionsWithCtaComponent,
    ],
})
export class SharedSxmUiUiDealAddonCardModule {}
