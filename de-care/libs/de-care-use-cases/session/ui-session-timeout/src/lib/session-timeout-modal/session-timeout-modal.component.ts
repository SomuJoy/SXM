import { DOCUMENT } from '@angular/common';
import { Component, ComponentFactoryResolver, Inject, NgModule } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiSessionTimeoutModule } from '@de-care/shared/sxm-ui/ui-session-timeout';

@Component({
    selector: 'session-timeout-modal',
    template: `
        <sxm-ui-modal [closed]="false" titlePresent="true" title="Session Timeout" (modalClosed)="refresh()">
            <sxm-ui-sesssion-timeout></sxm-ui-sesssion-timeout>
        </sxm-ui-modal>
    `,
})
export class SessionTimeoutModalComponent {
    private readonly _window: Window;

    constructor(@Inject(DOCUMENT) document: Document, private _activatedRoute: ActivatedRoute) {
        this._window = document.defaultView;
    }

    refresh() {
        const redirectUrl = this.getCaseInsensitiveParam(this._activatedRoute.snapshot.queryParamMap, 'redirectUrl');
        if (redirectUrl) {
            const url = new URL(redirectUrl);
            if (url.hostname.endsWith('siriusxm.com') || url.hostname.endsWith('siriusxm.ca')) {
                this._window.location.href = redirectUrl;
            } else {
                this._window.location.reload();
            }
        } else {
            this._window.location.reload();
        }
    }

    private getCaseInsensitiveParam(paramMap: ParamMap, keyToFind: string): string | null {
        const key = paramMap.keys.find((k) => k.toLowerCase() === keyToFind.toLowerCase());
        return paramMap.get(key);
    }
}

@NgModule({
    declarations: [SessionTimeoutModalComponent],
    exports: [SessionTimeoutModalComponent],
    imports: [SharedSxmUiUiModalModule, SharedSxmUiUiSessionTimeoutModule],
})
export class SessionTimeoutModalComponentModule {
    constructor(private readonly _componentFactoryResolver: ComponentFactoryResolver) {}

    getComponent() {
        return this._componentFactoryResolver.resolveComponentFactory(SessionTimeoutModalComponent);
    }
}
