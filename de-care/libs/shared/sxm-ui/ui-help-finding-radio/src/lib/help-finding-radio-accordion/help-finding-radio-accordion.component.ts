import { Component, ContentChild, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'sxm-ui-help-finding-radio-accordion',
    templateUrl: './help-finding-radio-accordion.component.html',
    styleUrls: ['./help-finding-radio-accordion.component.scss'],
})
export class SxmUiHelpFindingRadioAccordionComponent {
    @Input() showSearchByLicensePlateLink: boolean = false;
    @ContentChild('contentTitle') contentTitle: ElementRef;
    @Output() deviceHelp = new EventEmitter();

    onDeviceHelp(): void {
        this.deviceHelp.emit();
    }
}
