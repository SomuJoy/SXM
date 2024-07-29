import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckSubscriptionDetailsReadyWorkflowService } from '@de-care/de-care-use-cases/account/state-my-account-subscriptions';
@Injectable({ providedIn: 'root' })
export class SubscriptionDetailsCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _checkSubscriptionDetailsReadyWorkflowService: CheckSubscriptionDetailsReadyWorkflowService) {}
    canActivate(): Observable<boolean | UrlTree> {
        return this._checkSubscriptionDetailsReadyWorkflowService.build().pipe(map((ready) => (ready ? true : this._router.createUrlTree(['account/manage/subscriptions']))));
    }
}
