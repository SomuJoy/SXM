import { Component, Output, EventEmitter, Input, ContentChild, ElementRef } from '@angular/core';

@Component({
    selector: 'sxm-ui-help-finding-radio',
    templateUrl: './help-finding-radio.component.html',
    styleUrls: ['./help-finding-radio.component.scss'],
})
export class SxmUiHelpFindingRadioComponent {
    @Input() showDontHaveRadio: boolean = false;
    @Input() showSearchByLicensePlateLink: boolean = false;
    @Input() needHelp: boolean = false;

    @Output() deviceHelp = new EventEmitter();
    @Output() licensePlateHelp = new EventEmitter();

    // If required, overwrite first or second paragraph in the help find radio instructions
    @ContentChild('title') title: ElementRef;
    @ContentChild('contentParagraphOne') contentParagraphOne: ElementRef;
    @ContentChild('contentParagraphTwo') contentParagraphTwo: ElementRef;
}
