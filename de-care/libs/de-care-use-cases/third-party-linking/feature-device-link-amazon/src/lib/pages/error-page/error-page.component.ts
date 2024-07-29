import { AfterViewInit, Component } from '@angular/core';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { behaviorEventImpressionForPage, behaviorEventInteractionAmazonSupportLinkClick } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';

@Component({
    selector: 'de-care-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements AfterViewInit {
    translatePrefix = 'deCareUseCasesThirdPartyLinkingFeatureDeviceLinkAmazonModule.errorPageComponent';
    constructor(private readonly _store: Store) {}

    ngAfterViewInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'AcctLinking', componentKey: 'Linking_Error' }));
    }

    onSupportLinkClick() {
        this._store.dispatch(behaviorEventInteractionAmazonSupportLinkClick());
    }
}
