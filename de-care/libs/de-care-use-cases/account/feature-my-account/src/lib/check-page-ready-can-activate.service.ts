import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckPageReadyWorkflowService } from '@de-care/de-care-use-cases/account/state-my-account';
@Injectable({ providedIn: 'root' })
export class CheckPageReadyCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _checkPageReadyWorkflowService: CheckPageReadyWorkflowService) {}
    canActivate(): Observable<boolean | UrlTree> {
        return this._checkPageReadyWorkflowService.build().pipe(map((ready) => (ready ? true : this._router.createUrlTree(['error']))));
    }
}
