import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoadEnvironmentInfoWorkflowService } from '@de-care/domains/utility/state-environment-info';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadEnvironmentInfoCanActivateService implements CanActivate {
    constructor(private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService, private readonly _router: Router) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._loadEnvironmentInfoWorkflowService.build().pipe(catchError(() => of(this._router.createUrlTree(['/error']))));
    }
}
