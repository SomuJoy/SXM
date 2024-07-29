import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiToolTipComponent } from './tool-tip/tool-tip.component';
import { SharedSxmUiUiIconToolTipModule } from '@de-care/shared/sxm-ui/ui-icon-tool-tip';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [CommonModule, SharedSxmUiUiIconToolTipModule, TranslateModule.forChild()],
    declarations: [SxmUiToolTipComponent],
    exports: [SxmUiToolTipComponent],
})
export class SharedSxmUiUiTooltipModule {}
