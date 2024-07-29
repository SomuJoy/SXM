import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { behaviorEventInteractionLinkClick } from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { timer } from 'rxjs';

const sxmPlayerAppBaseUri = 'SIRIUSXM';
const WEB_PLAYER_URL_KEY = 'DomainsUtilityStateNativeAppIntegrationModule.SXM_WEB_PLAYER_URL';
const sxmPlayerVendorIds = {
    ios: '317951436',
    android: 'com.sirius',
};

type Platform = 'ios' | 'android' | 'web';

@Injectable({ providedIn: 'root' })
export class OpenNativeAppService {
    private readonly _window: Window;

    constructor(@Inject(DOCUMENT) document: Document, private readonly _store: Store, private readonly _translateService: TranslateService) {
        this._window = document?.defaultView;
    }

    openSxmPlayerApp(): void {
        const platform = this._getPlatform();
        switch (platform) {
            case 'web': {
                this._store.dispatch(behaviorEventInteractionLinkClick({ linkType: 'exit', linkName: '' }));
                this._window.open(this._translateService.instant(WEB_PLAYER_URL_KEY), '_self');
                return;
            }
            case 'ios':
            case 'android': {
                const appUri = `${sxmPlayerAppBaseUri}://RESUME`;

                const now = new Date().valueOf();
                timer(50).subscribe(() => {
                    if (new Date().valueOf() - now > 100) {
                        return;
                    }
                    this._window.location.href =
                        platform === 'ios' ? `itms-apps://itunes.apple.com/app/id${sxmPlayerVendorIds.ios}` : `market://details?id=${sxmPlayerVendorIds.android}&hl=en`;
                });
                this._store.dispatch(
                    behaviorEventInteractionLinkClick({
                        linkType: 'player',
                        linkName: '',
                    })
                );
                this._window.location.href = appUri;

                return;
            }
        }
    }

    private _getPlatform(): Platform {
        let platform: Platform = 'web';
        if (this._window?.navigator) {
            const { userAgent } = this._window.navigator;
            if (userAgent.match(/Android/i)) {
                platform = 'android';
            } else if (userAgent.match(/iPad|iPhone|iPod/i)) {
                platform = 'ios';
            }
        }
        return platform;
    }
}
