import { Component, OnInit, Inject, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { PrintService } from '@de-care/shared/browser-common/window-print';
import { SettingsService } from '@de-care/settings';
import { Store, select } from '@ngrx/store';
import { DOCUMENT } from '@angular/common';
import { getConfirmationData } from '@de-care/de-care-use-cases/cancel-subscription/state-cancel-request';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { getFeatureFlagEnableQuoteSummary } from '@de-care/shared/state-feature-flags';

@Component({
    selector: 'de-care-accept-offer-confirmation-page',
    templateUrl: './accept-offer-confirmation-page.component.html',
    styleUrls: ['./accept-offer-confirmation-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcceptOfferConfirmationPageComponent implements OnInit, AfterViewInit {
    confirmationData$ = this._store.pipe(select(getConfirmationData));
    enableQuoteSummaryFeatureToggle$ = this._store.pipe(select(getFeatureFlagEnableQuoteSummary));

    translateKeyPrefix = 'deCareUseCasesCancelSubscriptionFeatureCancelRequest.acceptOfferConfirmationPageComponent.';
    oacUrl = this._settingsSrv.settings.oacUrl;

    private readonly _window: Window;

    constructor(
        private readonly _printService: PrintService,
        private readonly _store: Store,
        @Inject(DOCUMENT) private readonly _document: Document,
        private readonly _settingsSrv: SettingsService
    ) {
        this._window = this._document && this._document.defaultView;
    }

    ngOnInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'acceptOfferConfirmation' }));
    }

    ngAfterViewInit() {
        // TODO: Find the actual cause for infinite loading
        this._store.dispatch(pageDataFinishedLoading());
    }

    backToMyAccount() {
        this._window.location.href = `${this._settingsSrv.settings.oacUrl}login_view.action?reset=true`;
    }

    onPrintClick() {
        this._printService.print();
    }
}
