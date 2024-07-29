import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SwapRadioWorkflowService } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';

@Injectable({ providedIn: 'root' })
export class SwapRadioPageCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _swapRadioWorkflowService: SwapRadioWorkflowService) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._swapRadioWorkflowService.build().pipe(
            map(() => true),
            catchError(() => {
                return of(this._router.createUrlTree(['error']));
            })
        );
    }
}
