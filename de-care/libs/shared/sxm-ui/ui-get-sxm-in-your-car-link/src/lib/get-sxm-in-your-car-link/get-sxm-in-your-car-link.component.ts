import { Component, EventEmitter, Output, Input } from '@angular/core';

interface LinkData {
    titleText: string;
    linkText: string;
    linkURL: string;
}

@Component({
    selector: 'sxm-ui-get-sxm-in-your-car-link',
    templateUrl: './get-sxm-in-your-car-link.component.html',
    styleUrls: ['./get-sxm-in-your-car-link.component.scss'],
})
export class GetSxmInYourCarLinkComponent {
    @Input() linkData: LinkData;
    @Output() getSXMInYourCarLinkClicked = new EventEmitter();

    trackGetSXMInYourCarLink(): void {
        this.getSXMInYourCarLinkClicked.emit();
    }
}
