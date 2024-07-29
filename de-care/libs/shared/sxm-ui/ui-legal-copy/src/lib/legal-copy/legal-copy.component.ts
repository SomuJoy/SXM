import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'sxm-ui-legal-copy',
    templateUrl: './legal-copy.component.html',
    styleUrls: ['./legal-copy.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SxmUiLegalCopyComponent {
    @Input() legalCopy: string;
}
