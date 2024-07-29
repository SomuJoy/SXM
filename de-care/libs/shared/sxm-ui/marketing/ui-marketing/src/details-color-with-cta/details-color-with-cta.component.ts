import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';

export interface OfferDetailsData {
    title: string;
    subtitle?: string;
    buttonLabel: string;
    legalCopy?: string;
}

@Component({
    selector: 'sxm-ui-details-color-with-cta',
    templateUrl: './details-color-with-cta.component.html',
    styleUrls: ['./details-color-with-cta.component.scss'],
})
export class SxmUiDetailsColorWithCtaComponent {
    @Input() data: OfferDetailsData;
    @Output() ctaClicked = new EventEmitter();
    loading = false;
}

@NgModule({
    declarations: [SxmUiDetailsColorWithCtaComponent],
    exports: [SxmUiDetailsColorWithCtaComponent],
    imports: [CommonModule, SharedSxmUiUiDataClickTrackModule, SharedSxmUiUiProceedButtonModule],
})
export class SharedSxmUiDetailsColorWithCtaComponentModule {}
