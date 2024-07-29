import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { SharedSxmUiUiIconRightArrowModule } from '@de-care/shared/sxm-ui/ui-icon-right-arrow';

@Component({
    selector: 'sxm-ui-account-help-with-right-arrow-icon',
    templateUrl: './account-help-with-right-arrow-icon.component.html',
    styleUrls: ['./account-help-with-right-arrow-icon.component.scss'],
})
export class SxmUiAccountHelpWithRightArrowIconComponent {
    @Input() data: string;
}

@NgModule({
    imports: [CommonModule, SharedSxmUiUiIconRightArrowModule],
    declarations: [SxmUiAccountHelpWithRightArrowIconComponent],
    exports: [SxmUiAccountHelpWithRightArrowIconComponent],
})
export class SxmUiAccountHelpWithRightArrowIconModule {}
