import { Injectable, Inject } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getOACLoginRedirectUrl } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { DOCUMENT } from '@angular/common';
import { Store, select } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class OacRedirectCanActivateService implements CanActivate {
    private readonly _window: Window;
    constructor(private readonly _store: Store, @Inject(DOCUMENT) document: Document) {
        this._window = document?.defaultView;
    }

    canActivate(): Observable<boolean | UrlTree> {
        return this._store.pipe(
            select(getOACLoginRedirectUrl),
            map((url) => {
                this._window.location.href = url;
                return false;
            })
        );
    }
}
