import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'sxm-ui-content-card',
    templateUrl: './content-card.component.html',
    styleUrls: ['./content-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SxmUiContentCardComponent {
    // content-card expects to receive flagPresent and headlinePresent from it's parent container
    @Input() flagPresent: boolean;
    @Input() headlinePresent: boolean;
    @Input() footerPresent: boolean;
    @Input() hasGrayBackground: boolean = false;
}
