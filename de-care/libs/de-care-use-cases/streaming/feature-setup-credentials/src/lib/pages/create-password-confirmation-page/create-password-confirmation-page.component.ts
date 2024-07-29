import { AfterViewInit, Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForComponent } from '@de-care/shared/state-behavior-events';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { OpenNativeAppService } from '@de-care/domains/utility/state-native-app-integration';

@Component({
    selector: 'de-care-create-password-confirmation-page',
    templateUrl: './create-password-confirmation-page.component.html',
    styleUrls: ['./create-password-confirmation-page.component.scss'],
})
export class CreatePasswordConfirmationPageComponent implements AfterViewInit {
    translateKeyPrefix = 'DeCareUseCasesStreamingFeatureSetupCredentialsModule.CreatePasswordConfirmationPageComponent.';
    private readonly _window: Window;

    constructor(
        private readonly _store: Store,
        @Inject(DOCUMENT) document: Document,
        public translate: TranslateService,
        private readonly _openNativeAppService: OpenNativeAppService
    ) {
        this._window = document?.defaultView;
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForComponent({ componentName: '' }));
    }

    onListenNowClick() {
        const link = this.translate.instant('DeCareUseCasesStreamingFeatureSetupCredentialsModule.Shared.PLAYER_LINK');
        if (link) {
            this._window.open(link, '_self');
        } else {
            this._openNativeAppService.openSxmPlayerApp();
        }
    }
}
