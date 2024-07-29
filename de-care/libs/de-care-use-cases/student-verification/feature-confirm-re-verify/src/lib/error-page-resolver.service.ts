import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ErrorPageDataWorkflowService, getQueryParamsAndSettings } from '@de-care/de-care-use-cases/student-verification/state-confirm-re-verify';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ErrorPageResolverService implements Resolve<any> {
    constructor(private store: Store, private _errorPageDataWorkflowService: ErrorPageDataWorkflowService) {}

    resolve(activatedRouteSnapshot: ActivatedRouteSnapshot) {
        let programCode;
        this.store.pipe(select(getQueryParamsAndSettings), first()).subscribe(({ programCode, isCanada }) => {
            programCode = this._handleProgramCode(programCode, isCanada);
        });
        return this._errorPageDataWorkflowService.build({ programCode, streaming: true, student: true });
    }

    private _handleProgramCode(code: string, isCanada: boolean): string {
        return !!code && code !== '' ? code : isCanada ? 'CASTUDENTPS12MO' : 'STUDENTPS12MO';
    }
}
