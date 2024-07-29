import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountModel, DataDevicesService, RadioModel } from '@de-care/data-services';
import { catchError, concatMap, map } from 'rxjs/operators';
import { NonPiiLookupWorkflow } from '@de-care/data-workflows';

@Injectable({ providedIn: 'root' })
export class RadioIdLookupService {
    constructor(private _dataDevicesService: DataDevicesService, private _nonPiiSrv: NonPiiLookupWorkflow) {}

    lookupAccountByRadioId(radioId: string): Observable<{ account: AccountModel; radio: RadioModel }> {
        return this._dataDevicesService.validate({ radioId }, false).pipe(
            concatMap((radio) => {
                return this._nonPiiSrv.build({ radioId: radioId.substring(radioId.length - 4) }).pipe(
                    map((account) => ({ account, radio })),
                    catchError((e) => {
                        throw {
                            ...e,
                            radioLookUpErrorType: 'radioCallError',
                        };
                    })
                );
            }),
            catchError((e) => {
                throw e.radioLookUpErrorType
                    ? e
                    : {
                          ...e,
                          radioLookUpErrorType: 'validateCallError',
                      };
            })
        );
    }

    lookupAccountByRadioIdForNFL(radioId: string, optInForNFL: boolean): Observable<{ account: AccountModel; radio: RadioModel }> {
        return this._dataDevicesService.validate({ radioId, optInForNFL }, false).pipe(
            concatMap((radio) => {
                return this._nonPiiSrv.build({ radioId: radioId.substring(radioId.length - 4) }).pipe(
                    map((account) => ({ account, radio })),
                    catchError((e) => {
                        throw {
                            ...e,
                            radioLookUpErrorType: 'radioCallError',
                        };
                    })
                );
            }),
            catchError((e) => {
                throw e.radioLookUpErrorType
                    ? e
                    : {
                          ...e,
                          radioLookUpErrorType: 'validateCallError',
                      };
            })
        );
    }
}
