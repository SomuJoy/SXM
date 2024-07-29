import { Component, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'privacy-policy',
    templateUrl: 'privacy-policy.component.html',
    styleUrls: ['privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
    @Input() customLink: string;
    @Input() useWindowOpen = false;
    translateKeyPrefix = 'sharedSxmUiUiPrivacyPolicyModule.privacyPolicyComponent';
    private readonly _window: Window;

    constructor(@Inject(DOCUMENT) readonly document: Document) {
        this._window = document?.defaultView;
    }

    onClick(event: Event): void {
        if (this.useWindowOpen && this._window && event?.target?.['href']) {
            this._window.open(event?.target?.['href']);
            event?.preventDefault();
            event?.stopPropagation();
        }
    }
}
