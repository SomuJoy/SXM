import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { NU_DETECT_SETTINGS, NuDetectSettings } from '@de-care/shared/configuration-tokens-nudetect';

@Injectable({
    providedIn: 'root',
})
export class NuDetectConfigService {
    private readonly _window: Window;

    constructor(
        private _cookieService: CookieService,
        @Inject(NU_DETECT_SETTINGS) private readonly _nuDetectSettings: NuDetectSettings,
        @Inject(DOCUMENT) private readonly _document: Document
    ) {
        this._window = this._document.defaultView;
    }

    initializeNuDetectConfig(placement: string): void {
        if (this._nuDetectSettings.ndClientEnabled) {
            const ndClientId = this._nuDetectSettings.ndClientId;
            const sessionId = this._cookieService.get('JSESSIONID');
            this._initializeNuDetect(ndClientId, sessionId, placement);
        }
    }

    private _initializeNuDetect(ndClientId: string, sessionId: string, placement: string): void {
        // NuData will provide a Client ID and instructions on how to proxy
        // the JS from nudatasecurity.com.
        // Clients can also set the browser to load JS directly from nudatasecurity.com
        // https://api-us-east-1.nd.nudatasecurity.com

        const baseUrl = 'https://captcha.siriusxm.com/2.2/w/' + ndClientId + '/sync/js/';
        (function (w, d, s, u, q, js, fjs, nds) {
            nds = w['ndsapi'] || (w['ndsapi'] = {});
            nds.config = {
                q: [],
                ready: function (cb) {
                    this.q.push(cb);
                },
            };
            js = d.createElement(s);
            fjs = d.getElementsByTagName(s)[0];
            js.src = u;
            fjs.parentNode.insertBefore(js, fjs);
            js.onload = function () {
                nds.load(u);
            };
        })(this._window, this._document, 'script', baseUrl);

        const globalNds = this._window['ndsapi'];
        globalNds.config.ready(function () {
            globalNds.setSessionId(sessionId);
            // The placement configuration starts here
            // Set for a multi-page purchase/checkout flow
            globalNds.setPlacement(placement);
            globalNds.setPlacementPage(1);
            //The placement configuration ends here
        });
    }
}
