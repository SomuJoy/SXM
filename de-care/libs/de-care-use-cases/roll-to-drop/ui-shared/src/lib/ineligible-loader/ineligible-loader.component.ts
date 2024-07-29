import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';

@Component({
    selector: 'de-care-ineligible-loader',
    templateUrl: './ineligible-loader.component.html',
    styleUrls: ['./ineligible-loader.component.scss']
})
export class IneligibleLoaderComponent {
    @Input() displayLoader = false;
    translateKeyPrefix = 'deCareUseCasesRollToDropUiSharedModule.ineligibleLoader';

    constructor(private readonly _store: Store) {}

    onLoadingWithAlertMessageComplete($event: boolean) {
        if ($event) {
            this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'Animation:notEligibleToPurchasePlan' }));
        }
    }
}
