import { Component, AfterViewInit } from '@angular/core';
import { getIsSonosFlow } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';

@Component({
    selector: 'de-care-activate-device-completed',
    templateUrl: './activate-device-completed-page.component.html',
    styleUrls: ['./activate-device-completed-page.component.scss'],
})
export class ActivatedDeviceCompletedPageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.ActivatedDeviceCompletedPageComponent.';
    isSonosFlow$ = this._store.select(getIsSonosFlow);

    constructor(private readonly _store: Store) {}

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'deviceregistrationconfirmation' }));
    }
}
