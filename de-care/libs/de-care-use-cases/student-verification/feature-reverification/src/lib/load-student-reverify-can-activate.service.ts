import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { LoadStudentReverifyWorkflowService } from '@de-care/de-care-use-cases/student-verification/state-reverification';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadStudentReverifyCanActivateService implements CanActivate {
    constructor(private _router: Router, private _loadStudentReverifyWorkflowService: LoadStudentReverifyWorkflowService) {}

    canActivate() {
        return this._loadStudentReverifyWorkflowService.build().pipe(
            map((status) => {
                if (status) {
                    return true;
                } else {
                    return this._goToError();
                }
            })
        );
    }

    private _goToError(): UrlTree {
        return this._router.createUrlTree(['student', 're-verify', 'error']);
    }
}
