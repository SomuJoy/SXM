import { StudentVerificationResponseModel } from './../data-services/verify-student.service';
import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { DataVerifyStudentService, StudentVerificationRequestModel } from '../data-services/verify-student.service';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class VerifyStudentWorkflowService implements DataWorkflow<{ verificationId }, StudentVerificationResponseModel> {
    constructor(private _dataVerifyStudentService: DataVerifyStudentService, private _store: Store) {}

    build(request: StudentVerificationRequestModel): Observable<StudentVerificationResponseModel> {
        return this._dataVerifyStudentService.verifyStudent(request.verificationId).pipe(
            catchError(error => {
                return throwError(error);
            })
        );
    }
}
