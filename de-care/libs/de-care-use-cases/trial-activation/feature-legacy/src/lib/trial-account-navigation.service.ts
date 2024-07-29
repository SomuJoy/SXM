import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SettingsService } from '@de-care/settings';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NormalizeLangPrefHelperService } from '@de-care/app-common';
import { Store } from '@ngrx/store';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class TrialAccountNavigationService {
    private readonly _window: Window;

    constructor(
        @Inject(DOCUMENT) document: Document,
        private _settingsService: SettingsService,
        private _router: Router,
        private _translateService: TranslateService,
        private _normalizeLangPrefHelperService: NormalizeLangPrefHelperService,
        private readonly _store: Store
    ) {
        this._window = document && document.defaultView;
    }

    gotoTrialExpiredPage(): void {
        this._router.navigate(['/activate/trial/trial-expired-overlay']);
    }

    gotoTrialThanksPage(thanksToken: string): void {
        this._router.navigate(['/activate/trial/thanks'], { queryParams: { thanksToken } });
    }

    gotoOneStepActivationConfirmationPage(thanksToken: string): void {
        this._router.navigate(['/activate/trial/one-step-thanks'], { queryParams: { thanksToken } });
    }

    goToBauNouv(): void {
        const lang = this._normalizeLangPrefHelperService.getLangKey(this._translateService.currentLang);
        this._store
            .select(getNormalizedQueryParams)
            .pipe(
                take(1),
                map(({ redirecturl }) => redirecturl as string)
            )
            .subscribe((redirectUrl) => {
                const url = new URL(redirectUrl);
                if (url.hostname.endsWith('siriusxm.com') || url.hostname.endsWith('siriusxm.ca')) {
                    this._window && (this._window.location.href = `${redirectUrl}&langpref=${lang}`);
                } else {
                    this._router.navigate(['/error']);
                }
            });
    }
}
