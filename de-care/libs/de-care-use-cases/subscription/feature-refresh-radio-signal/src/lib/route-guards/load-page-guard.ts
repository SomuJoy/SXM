import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoadPageWorkflowService } from '@de-care/de-care-use-cases/subscription/state-refresh-radio-signal';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadPageGuard implements CanActivate {
    constructor(private readonly _loadPageWorkflowService: LoadPageWorkflowService) {}

    canActivate(): Observable<boolean> {
        return this._loadPageWorkflowService.build();
    }
}
