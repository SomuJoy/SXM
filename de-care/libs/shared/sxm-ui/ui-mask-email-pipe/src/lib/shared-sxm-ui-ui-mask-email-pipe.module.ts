import { MaskEmailPipe } from './mask-email-pipe/mask-email.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [MaskEmailPipe],
    imports: [CommonModule],
    exports: [MaskEmailPipe]
})
export class SharedSxmUiUiMaskEmailPipeModule {}
