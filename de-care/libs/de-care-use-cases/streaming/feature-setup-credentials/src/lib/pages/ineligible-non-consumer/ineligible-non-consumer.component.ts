import { AfterViewInit, Component, OnInit } from '@angular/core';
import { selectSelectedSubscriptionSummaryViewModel } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { OpenNativeAppService } from '@de-care/domains/utility/state-native-app-integration';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';

@Component({
    selector: 'de-care-ineligible-non-consumer',
    templateUrl: './ineligible-non-consumer.component.html',
    styleUrls: ['./ineligible-non-consumer.component.scss'],
})
export class IneligibleNonConsumerComponent implements OnInit, AfterViewInit {
    subscription$ = this._store.pipe(select(selectSelectedSubscriptionSummaryViewModel));
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.IneligibleNonConsumerComponent.';
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
