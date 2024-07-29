import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { ConfirmationPageDataWorkflow } from '@de-care/de-care-use-cases/roll-to-drop/state-streaming-tokenized';
import { Observable } from 'rxjs';
import { catchError, mapTo } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ConfirmationPageCanActivateService implements CanActivate {
    constructor(private _confirmationPageDataWorkflow: ConfirmationPageDataWorkflow) {}

    canActivate(): Observable<boolean> | UrlTree {
        return this._confirmationPageDataWorkflow.build().pipe(
            mapTo(true),
            catchError(error => {
                throw new Error('Missing confirmation data' + error);
            })
        );
    }
}
