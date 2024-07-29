import { AfterViewInit, Component } from '@angular/core';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';

@Component({
    selector: 'de-care-success-page',
    templateUrl: './success-page.component.html',
    styleUrls: ['./success-page.component.scss']
})
export class SuccessPageComponent implements AfterViewInit {
    translatePrefix = 'deCareUseCasesThirdPartyLinkingFeatureDeviceLinkAmazonModule.successPageComponent';
    constructor(private readonly _store: Store) {}

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'AcctLinking', componentKey: 'AMZ_confirmation' }));
    }
}
