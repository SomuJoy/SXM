import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { SettingsService } from '@de-care/settings';

@Injectable({
    providedIn: 'root'
})
export class CheckoutNavigationService {
    private readonly _window: Window;

    constructor(@Inject(DOCUMENT) document: Document, private _settingsService: SettingsService) {
        this._window = document && document.defaultView;
    }

    goToConfirmationPageReloaded() {
        this._window && (this._window.location.href = this._settingsService.settings.oacUrl);
    }
}
