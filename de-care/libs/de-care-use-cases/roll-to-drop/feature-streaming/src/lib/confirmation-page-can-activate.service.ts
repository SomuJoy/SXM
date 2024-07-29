import { mapTo, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { ConfirmationPageDataWorkflow } from '@de-care/de-care-use-cases/roll-to-drop/state-streaming';

@Injectable({ providedIn: 'root' })
export class ConfirmationPageCanActivateService implements CanActivate {
    constructor(private readonly _confirmationPageDataWorkflow: ConfirmationPageDataWorkflow) {}

    canActivate(): Observable<boolean> | UrlTree {
        return this._confirmationPageDataWorkflow.build().pipe(
            mapTo(true),
            catchError(() => {
                throw new Error('Missing confirmation data');
            })
        );
    }
}
