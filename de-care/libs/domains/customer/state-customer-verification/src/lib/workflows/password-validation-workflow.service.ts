import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { PasswordValidationService } from '../data-services/password-validation.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface PasswordValidationWorkflowError {
    type: 'POLICY' | 'RESERVED_WORD';
    reservedWord?: string;
}

@Injectable({ providedIn: 'root' })
export class PasswordValidationWorkflowService implements DataWorkflow<{ password: string }, boolean> {
    constructor(private readonly _store: Store, private readonly _passwordValidationService: PasswordValidationService) {}

    build({ password }): Observable<boolean> {
        return this._passwordValidationService.validatePassword(password).pipe(
            tap((response) => {
                // TODO: add behavior tracking here
            }),
            map((response) => {
                if (response.valid) {
                    return true;
                } else {
                    switch (response.validationErrorKey) {
                        case 'validation.password.new.dictionaryWords': {
                            throw { type: 'RESERVED_WORD', reservedWord: response.validationErrorFailedWord } as PasswordValidationWorkflowError;
                        }
                        case 'validation.password.new.charsAllowed':
                        default: {
                            throw { type: 'POLICY' } as PasswordValidationWorkflowError;
                        }
                    }
                }
            })
        );
    }
}
