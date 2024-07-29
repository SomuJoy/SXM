import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectOfferTermLength, getSubscriptionId, pageDataFinishedLoading } from '@de-care/de-care-use-cases/student-verification/state-confirm-re-verify';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { ScrollService } from '@de-care/shared/browser-common/window-scroll';

@Component({
    selector: 'de-care-offer-to-offer-confirmation-page',
    templateUrl: './offer-to-offer-confirmation-page.component.html',
    styleUrls: ['./offer-to-offer-confirmation-page.component.scss'],
})
export class OfferToOfferConfirmationComponent implements OnInit, AfterViewInit {
    constructor(private _store: Store, private readonly _scrollService: ScrollService) {}

    offerTermLength$ = this._store.pipe(select(selectOfferTermLength));
    subscriptionId$ = this._store.pipe(select(getSubscriptionId));
    translateKeyPrefix = 'deCareUseCasesStudentVerificationFeatureConfirmReVerifyModule.offerToOfferConfirmationPageComponent';

    ngOnInit() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'authentication', componentKey: 'StudentPlanExtendSuccess' }));
        this._store.dispatch(pageDataFinishedLoading());
    }

    ngAfterViewInit(): void {
        this._scrollService.scrollToElementBySelector('listen-now');
    }
}
