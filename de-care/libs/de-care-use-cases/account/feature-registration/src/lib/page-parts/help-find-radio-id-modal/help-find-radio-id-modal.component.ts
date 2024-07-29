import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'de-care-help-find-radio-id-modal',
    templateUrl: './help-find-radio-id-modal.component.html',
    styleUrls: ['./help-find-radio-id-modal.component.scss']
})
export class HelpFindRadioIdModalComponent {
    translateKeyPrefix = 'deCareUseCasesAccountFeatureRegistration.HelpFindRadioIdModalComponent';
    @Output() openMarineAviationDevicesModal = new EventEmitter();
}
