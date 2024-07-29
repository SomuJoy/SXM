import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadConfirmationPageData } from '@de-care/de-care-use-cases/checkout/state-streaming';

@Injectable({ providedIn: 'root' })
export class OrganicConfirmationCanActivateService implements CanActivate {
    constructor(private readonly _store: Store) {}

    canActivate(): boolean {
        this._store.dispatch(loadConfirmationPageData());
        return true;
    }
}
