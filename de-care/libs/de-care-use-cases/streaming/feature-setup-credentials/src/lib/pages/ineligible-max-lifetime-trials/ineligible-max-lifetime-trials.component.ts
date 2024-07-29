import { AfterViewInit, Component, OnInit } from '@angular/core';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';
import { OpenNativeAppService } from '@de-care/domains/utility/state-native-app-integration';
import { selectSelectedSubscriptionSummaryViewModel } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';

@Component({
    selector: 'de-care-ineligible-max-lifetime-trials',
    templateUrl: './ineligible-max-lifetime-trials.component.html',
    styleUrls: ['./ineligible-max-lifetime-trials.component.scss'],
})
export class IneligibleMaxLifetimeTrialsComponent implements OnInit, AfterViewInit {
    subscription$ = this._store.pipe(select(selectSelectedSubscriptionSummaryViewModel));
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.IneligibleMaxLifetimeTrialsComponent.';
    constructor(private readonly _store: Store, private readonly _openNativeAppService: OpenNativeAppService) {}

    ngOnInit(): void {
        console.log('Ineligible screen');
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'noteligiblefortrial' }));
    }

    onPreviewClick() {
        this._openNativeAppService.openSxmPlayerApp();
    }
}
