import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadEnvironmentInfoWorkflowService } from './workflows/load-environment-info-workflow.service';

// Use this resolver when you need to load environment info and don't want the app to error if the call fails
@Injectable({ providedIn: 'root' })
export class LoadEnvironmentInfoResolver implements Resolve<boolean> {
    constructor(private readonly _loadEnvironmentInfoWorkflowService: LoadEnvironmentInfoWorkflowService) {}

    resolve(): Observable<boolean> {
        return this._loadEnvironmentInfoWorkflowService.build().pipe(catchError(_ => of(false)));
    }
}
