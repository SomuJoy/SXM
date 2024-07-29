import { AfterViewInit, Component, OnInit } from '@angular/core';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store, select } from '@ngrx/store';
import { getFeatureFlagIapEnableContactUsTelephone } from '@de-care/shared/state-feature-flags';
import { OpenNativeAppService } from '@de-care/domains/utility/state-native-app-integration';

@Component({
    selector: 'de-care-ineligible-expired-aa-trial',
    templateUrl: './ineligible-expired-aa-trial.component.html',
    styleUrls: ['./ineligible-expired-aa-trial.component.scss']
})
export class IneligibleExpiredAaTrialComponent implements OnInit, AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.IneligibleExpiredAATrialComponent.';
    contactUsTelephoneEnabled$ = this._store.pipe(select(getFeatureFlagIapEnableContactUsTelephone));
    constructor(private readonly _store: Store, private readonly _openNativeAppService: OpenNativeAppService) {}

    ngOnInit(): void {
        console.log('Ineligible screen');
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: 'trialexpired' }));
    }

    onPreviewClick() {
        this._openNativeAppService.openSxmPlayerApp();
    }
}
