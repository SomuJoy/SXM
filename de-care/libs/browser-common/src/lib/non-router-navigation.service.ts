import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NonRouterNavigationService {
    private readonly _window: Window;

    constructor(@Inject(DOCUMENT) document) {
        this._window = document && document.defaultView;
    }

    goToLocation(url): void {
        this._window && (this._window.location.href = url);
    }
}
