import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';

@Component({
    selector: 'de-care-ui-lookup-by-radio-id-or-account-number-modal',
    templateUrl: './ui-lookup-by-radio-id-or-account-number-modal.component.html',
    styleUrls: ['./ui-lookup-by-radio-id-or-account-number-modal.component.scss']
})
export class UiLookupByRadioIdOrAccountNumberModalComponent implements OnChanges {
    @Input() open = false;
    @Output() closed = new EventEmitter();
    @ViewChild('helpFindRadioId', { static: true }) helpFindRadioId: SxmUiModalComponent;
    @ViewChild('marineAviationDevices', { static: true }) marineAviationDevices: SxmUiModalComponent;
    translateKeyPrefix = 'deCareUseCasesAccountFeatureRegistration.UiLookupByRadioIdOrAccountNumberComponent';

    constructor(private readonly _store: Store) {}

    ngOnChanges(): void {
        if (this.open) {
            this.helpFindRadioId.open();
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'overlay:radioidhelp' }));
        } else {
            this.helpFindRadioId.close();
        }
    }

    openMarineAviationDevicesModal(): void {
        this.helpFindRadioId.close();
        this.marineAviationDevices.open();
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'overlay:marineaviationhelp' }));
    }

    backToRadioId(): void {
        this.marineAviationDevices.close();
        this.helpFindRadioId.open();
    }
}
