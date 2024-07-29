import { Component, OnInit } from '@angular/core';
import { DoNotCallSubmitResultModel } from '../../page-parts/do-not-call-form/do-not-call-form.component';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'do-not-call-flow',
    templateUrl: './do-not-call-flow.component.html',
    styleUrls: ['./do-not-call-flow.component.scss']
})
export class DoNotCallFlowComponent implements OnInit {
    hasSubmitted = false;
    wasSuccessful: boolean;
    phoneNumber: string;

    constructor(private readonly _store: Store) {}

    ngOnInit() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'DNC', componentKey: 'dncLanding' }));
    }

    phoneSubmitted(result: DoNotCallSubmitResultModel) {
        this.hasSubmitted = true;
        if (result.status === 'success') {
            this.wasSuccessful = true;
            this.phoneNumber = result.phoneNumber;
            this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'DNC', componentKey: 'dncThankYou' }));
        } else {
            this.wasSuccessful = false;
            this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'DNC', componentKey: 'dncError' }));
        }
    }
}
