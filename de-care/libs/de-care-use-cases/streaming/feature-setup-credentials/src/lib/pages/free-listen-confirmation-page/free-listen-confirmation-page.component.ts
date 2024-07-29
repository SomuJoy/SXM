import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { OpenNativeAppService } from '@de-care/domains/utility/state-native-app-integration';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'de-care-free-listen-confirmation-page',
    templateUrl: './free-listen-confirmation-page.component.html',
    styleUrls: ['./free-listen-confirmation-page.component.scss'],
})
export class FreeListenConfirmationPageComponent implements OnInit, AfterViewInit {
    private readonly _window: Window;
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.FreeListenConfirmationPageComponent.';
    constructor(
        private readonly _store: Store,
        private readonly _openNativeAppService: OpenNativeAppService,
        public _translateService: TranslateService,
        @Inject(DOCUMENT) document: Document
    ) {
        this._window = document?.defaultView;
    }

    ngOnInit(): void {
        console.log('');
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
    }

    onSignInClick() {
        const link = this._translateService.instant('DeCareUseCasesStreamingFeatureSetupCredentialsModule.Shared.PLAYER_LINK');
        if (link) {
            this._window.open(link, '_self');
        } else {
            this._openNativeAppService.openSxmPlayerApp();
        }
    }
}
