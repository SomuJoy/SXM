import { Component, Inject, AfterViewInit } from '@angular/core';
import { PrintService } from '@de-care/shared/browser-common/window-print';
import { SettingsService } from '@de-care/settings';
import { Store, select } from '@ngrx/store';
import { getConfirmationData } from '@de-care/de-care-use-cases/change-subscription/state-purchase';
import { DOCUMENT } from '@angular/common';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { getFeatureFlagEnableQuoteSummary } from '@de-care/shared/state-feature-flags';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { scrollToTop } from '@de-care/browser-common';

@Component({
    selector: 'de-care-confirmation-page',
    templateUrl: './confirmation-page.component.html',
    styleUrls: ['./confirmation-page.component.scss'],
})
export class ConfirmationPageComponent implements AfterViewInit {
    confirmationData$ = this._store.pipe(select(getConfirmationData));
    enableQuoteSummaryFeatureToggle$ = this._store.pipe(select(getFeatureFlagEnableQuoteSummary));
    translateKeyPrefix = 'deCareUseCasesChangeSubscriptionFeaturePurchaseModule.confirmationPageComponent.';
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

    ngAfterViewInit() {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'confirmation' }));
        // TODO: Find the actual cause for infinite loading
        this._store.dispatch(pageDataFinishedLoading());
        scrollToTop();
    }

    backToMyAccount() {
        this._window.location.href = `${this._settingsSrv.settings.oacUrl}login_view.action?reset=true`;
    }

    onPrintClick() {
        this._printService.print();
    }
}
