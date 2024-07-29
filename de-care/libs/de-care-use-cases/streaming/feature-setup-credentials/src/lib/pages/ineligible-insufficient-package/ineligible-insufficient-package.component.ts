import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { selectSelectedSubscriptionSummaryViewModel } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';

@Component({
    selector: 'de-care-ineligible-insufficient-package',
    templateUrl: './ineligible-insufficient-package.component.html',
    styleUrls: ['./ineligible-insufficient-package.component.scss'],
})
export class IneligibleInsufficientPackageComponent implements OnInit, AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.IneligibleInsufficientPackageComponent.';
    private readonly _window: Window;
    subscription$ = this._store.pipe(select(selectSelectedSubscriptionSummaryViewModel));

    constructor(private readonly _store: Store, @Inject(DOCUMENT) document: Document, public translate: TranslateService) {
        this._window = document?.defaultView;
    }

    ngOnInit(): void {
        console.log('Ineligible screen');
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'noteligiblefortrial' }));
    }

    onUpgradeClick(subs, url) {
        const radioId = subs.last4DigitsOfRadioId;
        const act = subs.last4DigitsOfAccountNumber;
        const translateUrl = this.translate.instant(url);
        this._window.location.href = translateUrl + `?RadioID=${radioId}&act=${act}`;
    }
}
