import { AfterViewInit, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';

@Component({
    selector: 'de-care-radio-id-page',
    templateUrl: './radio-id-page.component.html',
    styleUrls: ['./radio-id-page.component.scss']
})
export class RadioIdPageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.RadioIdPageComponent.';

    constructor(private readonly _store: Store) {}

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
    }
}
