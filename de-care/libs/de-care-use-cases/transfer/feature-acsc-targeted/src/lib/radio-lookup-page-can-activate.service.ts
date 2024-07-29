import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IdentificationWithoutRadioWorkflowService, IdentificationWithoutRadioWorkflowServiceError } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';

@Injectable({ providedIn: 'root' })
export class RadioLookupPageCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _identificationWithoutRadioWorkflowService: IdentificationWithoutRadioWorkflowService) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._identificationWithoutRadioWorkflowService.build().pipe(
            map((response) => {
                return response ? true : this._router.createUrlTree(['transfer/radio/error']);
            }),
            catchError((error: IdentificationWithoutRadioWorkflowServiceError) => {
                switch (error) {
                    case 'user not logged in':
                        return of(this._router.createUrlTree(['transfer/radio/login']));
                    case 'network error':
                    default:
                        return of(this._router.createUrlTree(['transfer/radio/error']));
                }
            })
        );
    }
}
