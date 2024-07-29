import { Component, ViewChild } from '@angular/core';
import { SxmUiModalComponent } from '@de-care/shared/sxm-ui/ui-modal';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { BehaviorSubject } from 'rxjs';
@Component({
    selector: 'sxm-ui-listen-on-devices-info',
    templateUrl: './listen-on-devices-info.component.html',
    styleUrls: ['./listen-on-devices-info.component.scss'],
})
export class SxmUiListenOnDevicesInfoComponent {
    translateKeyPrefix = 'SharedSxmUiUiListenOnDevicesModule.SxmUiListenOnDevicesInfoComponent.';
    @ViewChild('AppleTVDeviceSetup') private readonly _AppleTVDeviceSetup: SxmUiModalComponent;
    @ViewChild('AmazonDeviceSetup') private readonly _AmazonDeviceSetup: SxmUiModalComponent;
    @ViewChild('GoogleDeviceSetup') private readonly _GoogleDeviceSetup: SxmUiModalComponent;
    @ViewChild('BoseDeviceSetup') private readonly _BoseDeviceSetup: SxmUiModalComponent;
    @ViewChild('RokuDeviceSetup') private readonly _RokuDeviceSetup: SxmUiModalComponent;
    @ViewChild('SamsungDeviceSetup') private readonly _SamsungDeviceSetup: SxmUiModalComponent;
    @ViewChild('LGDeviceSetup') private readonly _LGDeviceSetup: SxmUiModalComponent;
    allDevicesVisible$ = new BehaviorSubject(false);

    constructor(private readonly _store: Store) {}
    openDeviceModal(key) {
        if (key === 'Amazon') {
            this._AmazonDeviceSetup.open();
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
        } else if (key === 'Apple TV') {
            this._AppleTVDeviceSetup.open();
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
        } else if (key === 'Google') {
            this._GoogleDeviceSetup.open();
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
        } else if (key === 'Bose') {
            this._BoseDeviceSetup.open();
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
        } else if (key === 'Roku') {
            this._RokuDeviceSetup.open();
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
        } else if (key === 'Samsung') {
            this._SamsungDeviceSetup.open();
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
        } else if (key === 'LG') {
            this._LGDeviceSetup.open();
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
        }
    }
}
