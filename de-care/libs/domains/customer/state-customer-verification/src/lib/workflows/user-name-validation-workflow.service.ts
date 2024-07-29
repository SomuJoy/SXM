import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable } from 'rxjs';
import { UserNameValidatePayload } from '../data-services/customer-validation.interface';
import { UserNameValidationService } from '../data-services/user-name-validation.service';
import { setReuseUserName } from '../state/actions';

@Injectable({ providedIn: 'root' })
export class UserNameValidationWorkFlow implements DataWorkflow<UserNameValidatePayload, boolean> {
    constructor(private readonly _userNameValidationService: UserNameValidationService, private readonly _store: Store) {}

    build(requestPayload: UserNameValidatePayload): Observable<boolean> {
        return this._userNameValidationService.validateUserName(requestPayload).pipe(
            tap(data => this._store.dispatch(setReuseUserName({ reuseUserName: !data.valid }))),
            map(data => data.valid)
        );
    }
}
