import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserEnteredCustomerInfo } from '@de-care/customer-state';
import { DataAccountService, isQCPostalCode, CustomerSessionInfoModel } from '@de-care/data-services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsService, UserSettingsService } from '@de-care/settings';

@Injectable()
export class CustomerInfoPrefillResolver implements Resolve<Observable<UserEnteredCustomerInfo>> {
    constructor(private _dataAccountService: DataAccountService, private _userSettingsService: UserSettingsService, private _settingsService: SettingsService) {}

    mapCustomerSessionInfoModel(serverResponse: CustomerSessionInfoModel) {
        // We don't need to convert between CustomerSessionInfoModel and UserEnteredCustomerInfo
        // because they have the same fields right now
        return serverResponse as UserEnteredCustomerInfo;
    }

    resolve(): Observable<UserEnteredCustomerInfo> {
        return this._dataAccountService.getCustomerDataFromSession().pipe(
            map(sessionData => {
                if (this._settingsService.isCanadaMode && isQCPostalCode(sessionData.zipCode)) {
                    this._userSettingsService.setSelectedCanadianProvince('QC');
                }
                return this.mapCustomerSessionInfoModel(sessionData);
            })
        );
    }
}
