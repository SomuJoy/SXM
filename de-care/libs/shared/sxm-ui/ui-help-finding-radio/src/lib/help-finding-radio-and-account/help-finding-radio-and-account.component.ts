import { Component, Output, EventEmitter, Input, ContentChild, ElementRef } from '@angular/core';

@Component({
    selector: 'sxm-ui-help-finding-radio-and-account',
    templateUrl: './help-finding-radio-and-account.component.html',
    styleUrls: ['./help-finding-radio-and-account.component.scss'],
})
export class SXMUiHelpFindingRadioAndAccountComponent {
    @Input() showDontHaveRadio: boolean = false;
    @Input() showSearchByLicensePlateLink: boolean = false;

    @Output() deviceHelp = new EventEmitter();
    @Output() licensePlateHelp = new EventEmitter();

    // If required, overwrite first or second paragraph in the help find radio instructions
    @ContentChild('title') title: ElementRef;
    @ContentChild('contentParagraphOne') contentParagraphOne: ElementRef;
    @ContentChild('contentParagraphTwo') contentParagraphTwo: ElementRef;
    @ContentChild('contentParagraphThree') contentParagraphThree: ElementRef;
}
