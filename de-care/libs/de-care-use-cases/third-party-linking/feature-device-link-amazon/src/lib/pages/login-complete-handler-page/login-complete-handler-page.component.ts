import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'de-care-login-complete-handler-page',
    template: `
        <p>Loading...</p>
    `
})
export class LoginCompleteHandlerPageComponent implements OnInit {
    private _code: string;
    private readonly _window: Window;
    private _parentWindow: Window;

    constructor(private readonly _route: ActivatedRoute, @Inject(DOCUMENT) document: Document) {
        this._window = document && document.defaultView;
    }

    ngOnInit() {
        this._code = this._route.snapshot.queryParamMap.get('code');
        this._parentWindow = this._window.opener;
        if (!!this._parentWindow) {
            this._parentWindow.postMessage({ code: this._code }, this._window.location.origin);
        }
        this._window.close();
    }
}
