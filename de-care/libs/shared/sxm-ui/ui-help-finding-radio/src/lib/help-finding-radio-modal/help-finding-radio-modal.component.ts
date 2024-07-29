import { Component, Input, ViewChild } from '@angular/core';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import * as uuid from 'uuid/v4';

@Component({
    selector: 'sxm-ui-help-finding-radio-modal',
    templateUrl: './help-finding-radio-modal.component.html',
    styleUrls: ['./help-finding-radio-modal.component.scss']
})
export class HelpFindingRadioModalComponent {
    translateKeyPrefix = 'SharedSxmUiUiHelpFindingRadioModule.HelpFindingRadioModalComponent.';
    @Input() showBackButton = false;
    @Input() isCanadaMode = false;
    @ViewChild('helpFindingRadioModal') private _helpFindingRadioModal: SxmUiModalComponent;
    deviceHelpModalAriaDescribedbyTextId = uuid();

    open() {
        this._helpFindingRadioModal?.open();
    }
}
