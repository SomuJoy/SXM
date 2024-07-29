import { AfterViewInit, Component } from '@angular/core';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { Store } from '@ngrx/store';
import { TrialAccountNavigationService } from '../../trial-account-navigation.service';

@Component({
    selector: 'trial-expired-overlay-component',
    templateUrl: 'trial-expired-overlay.component.html',
    styleUrls: ['trial-expired-overlay.component.scss']
})
export class TrialExpiredOverlayComponent implements AfterViewInit {
    constructor(private readonly _trialAccountNavigation: TrialAccountNavigationService, private readonly _store: Store) {}

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
    }

    continue() {
        this._trialAccountNavigation.goToBauNouv();
    }
}
