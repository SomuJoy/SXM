import { AfterViewInit, Component } from '@angular/core';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { Store } from '@ngrx/store';
import { getFirstName } from '@de-care/de-care-use-cases/account/state-registration';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';

@Component({
    selector: 'de-care-registration-completed-page',
    templateUrl: './registration-completed-page.component.html',
    styleUrls: ['./registration-completed-page.component.scss'],
})
export class RegistrationCompletedPageComponent implements AfterViewInit {
    translateKeyPrefix = 'deCareUseCasesAccountFeatureRegistration.registrationCompletedPageComponent';
    firstName$ = this._store.select(getFirstName);

    constructor(private readonly _store: Store) {}

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'registration', componentKey: 'regcomplete' }));
    }
}
