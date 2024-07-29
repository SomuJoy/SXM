import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'sxm-ui-side-title',
    templateUrl: './side-title.component.html',
    styleUrls: ['./side-title.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SxmUiSideTitleComponent {
    @Input() title: string;
    @Input() mainParagraph: string[];
}
