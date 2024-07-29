import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { GetSxmInYourCarLinkComponent } from './get-sxm-in-your-car-link/get-sxm-in-your-car-link.component';

@NgModule({
    imports: [CommonModule, SharedSxmUiUiDataClickTrackModule],
    declarations: [GetSxmInYourCarLinkComponent],
    exports: [GetSxmInYourCarLinkComponent],
})
export class SharedSxmUiUiGetSxmInYourCarLinkModule {}
