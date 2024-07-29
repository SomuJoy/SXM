import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TempIncludeGlobalStyleScriptCanActivateService implements CanActivate {
    constructor(@Inject(DOCUMENT) private readonly _document: Document, private readonly _http: HttpClient) {}

    canActivate(): Observable<boolean> {
        const head = this._document?.querySelector('head');
        if (head && !head.innerHTML.includes(`src="assets/sxm.slam.min.js"`)) {
            const node = document.createElement('script');
            node.src = 'assets/sxm.slam.min.js';
            node.type = 'text/javascript';
            node.async = true;
            head.appendChild(node);
        }
        if (!this._document.querySelector('#legacyGlobalCss')) {
            return this._http.get('assets/sxm.min.css', { responseType: 'text' }).pipe(
                tap((css) => {
                    this._document.querySelector('head').innerHTML += `<style type="text/css" id="legacyGlobalCss">${css}</style>`;
                }),
                map(() => true)
            );
        } else {
            return of(true);
        }
    }
}
