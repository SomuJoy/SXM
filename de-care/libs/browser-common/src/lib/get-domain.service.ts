import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GetDomainService {
    private readonly _window: Window;

    constructor(@Inject(DOCUMENT) document) {
        this._window = document && document.defaultView;
    }

    getDomain(): string {
        const hostname = this._window?.location?.hostname;
        const firstDotPos = hostname.indexOf('.');
        return firstDotPos !== -1 ? hostname.slice(firstDotPos + 1) : null;
    }
}
