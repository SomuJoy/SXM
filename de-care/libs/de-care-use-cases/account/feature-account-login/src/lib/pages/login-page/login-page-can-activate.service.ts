import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadAccountLoginDataWorkflowService } from '@de-care/de-care-use-cases/account/state-account-login';

@Injectable({ providedIn: 'root' })
export class LoginPageCanActivateService implements CanActivate {
    constructor(private readonly _loadAccountLoginDataWorkflowService: LoadAccountLoginDataWorkflowService) {}

    canActivate(): Observable<boolean> {
        return this._loadAccountLoginDataWorkflowService.build();
    }
}
